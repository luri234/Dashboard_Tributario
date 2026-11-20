#!/usr/bin/env python3
"""
Transformación CSV -> JSON del dataset "Recaudación de Impuestos" (SRI Ecuador).

Qué hace:
  1. Lee el CSV (separador '|', UTF-8) y valida el encabezado.
  2. Limpia texto: quita espacios al inicio/fin y colapsa espacios múltiples.
  3. Convierte tipos:
       - ANIO              -> entero
       - MES "12 Diciembre"-> MES (entero 1-12) + MES_NOMBRE (texto)
       - VALOR_RECAUDADO   -> número (coma decimal -> punto)
       - resto             -> cadenas de texto
  4. Registra filas rechazadas (columnas incorrectas, números inválidos, etc.).
  5. Escribe el JSON y un reporte de validación (.json) con conteos y hallazgos.
  6. Relee el JSON generado y comprueba cantidad de registros y tipos.

Uso:
  python csv_a_json.py entrada.csv salida.json
  python csv_a_json.py entrada.csv salida.json --pretty
  python csv_a_json.py entrada.csv salida.json --delimiter ","

Solo usa la biblioteca estándar de Python 3.8+.
"""
import argparse
import csv
import json
import re
import sys
from collections import Counter, defaultdict

COLUMNAS = [
    "ANIO", "MES", "GRUPO_IMPUESTO", "SUBGRUPO_IMPUESTO", "IMPUESTO",
    "GRAN_CONTRIBUYENTE", "CODIGO_OPERA_FAMILIA", "TIPO_CONTRIBUYENTE",
    "PROVINCIA", "CANTON", "VALOR_RECAUDADO",
]
COLUMNAS_TEXTO = [c for c in COLUMNAS if c not in ("ANIO", "MES", "VALOR_RECAUDADO")]

MESES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "setiembre": 9, "octubre": 10,
    "noviembre": 11, "diciembre": 12,
}
RE_MES = re.compile(r"^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)$")
RE_ESPACIOS = re.compile(r"\s+")
# Caracteres típicos de una mala codificación (ej. '¿' o '�') en textos
RE_CODIF = re.compile("[\ufffd¿]")


def limpiar(texto):
    """Quita espacios sobrantes; devuelve None si queda vacío."""
    if texto is None:
        return None
    texto = RE_ESPACIOS.sub(" ", texto.replace("\u00a0", " ")).strip()
    return texto if texto != "" else None


def parsear_numero(texto):
    """'51067,9000' -> 51067.9 ; admite '1.234,56' y '1234.56'."""
    if texto is None:
        raise ValueError("valor vacío")
    t = texto.replace(" ", "")
    if "," in t and "." in t:
        t = t.replace(".", "").replace(",", ".")  # 1.234,56
    else:
        t = t.replace(",", ".")
    return float(t)


def parsear_mes(texto):
    """'12 Diciembre' -> (12, 'Diciembre')."""
    m = RE_MES.match(texto or "")
    if not m:
        raise ValueError(f"MES con formato inesperado: {texto!r}")
    num, nombre = int(m.group(1)), m.group(2)
    if not 1 <= num <= 12:
        raise ValueError(f"MES fuera de rango: {num}")
    if MESES.get(nombre.lower()) != num:
        raise ValueError(f"MES inconsistente (número y nombre no coinciden): {texto!r}")
    return num, nombre.capitalize()


def abrir_csv(ruta, encoding):
    """Abre con la codificación pedida; si falla, prueba utf-8-sig y latin-1."""
    for enc in [encoding, "utf-8-sig", "latin-1"]:
        try:
            with open(ruta, encoding=enc, newline="") as f:
                f.read()
            return enc
        except UnicodeDecodeError:
            continue
    raise SystemExit("No se pudo decodificar el archivo con utf-8 ni latin-1.")


def transformar(ruta_csv, delimitador, encoding):
    enc = abrir_csv(ruta_csv, encoding)
    registros, rechazadas = [], []
    stats = {
        "filas_leidas": 0,
        "valores_vacios_por_columna": Counter(),
        "valores_negativos": 0,
        "valores_cero": 0,
        "filas_duplicadas_exactas": 0,
        "textos_con_posible_error_de_codificacion": 0,
        "textos_con_espacios_corregidos": 0,
    }
    vistos = set()
    canton_provincias = defaultdict(Counter)

    with open(ruta_csv, encoding=enc, newline="") as f:
        lector = csv.reader(f, delimiter=delimitador)
        encabezado = [limpiar(c) for c in next(lector)]
        encabezado = ["CANTON" if c in ("CANTÓN", "CANTON") else c for c in encabezado]
        if encabezado != COLUMNAS:
            raise SystemExit(f"Encabezado inesperado.\n  Esperado: {COLUMNAS}\n  Recibido: {encabezado}")

        for n, fila in enumerate(lector, start=2):  # n = número de línea en el archivo
            if not fila or all(c.strip() == "" for c in fila):
                continue
            stats["filas_leidas"] += 1
            if len(fila) != len(COLUMNAS):
                rechazadas.append({"linea": n, "motivo": f"{len(fila)} columnas (se esperaban {len(COLUMNAS)})"})
                continue

            crudo = dict(zip(COLUMNAS, fila))
            limpio = {}
            for col, val in crudo.items():
                v = limpiar(val)
                if col in COLUMNAS_TEXTO and val is not None and v != val.strip():
                    stats["textos_con_espacios_corregidos"] += 1
                if v is None:
                    stats["valores_vacios_por_columna"][col] += 1
                limpio[col] = sys.intern(v) if (v and col in COLUMNAS_TEXTO) else v

            try:
                if limpio["ANIO"] is None:
                    raise ValueError("ANIO vacío")
                anio = int(limpio["ANIO"])
                mes, mes_nombre = parsear_mes(limpio["MES"])
                valor = parsear_numero(limpio["VALOR_RECAUDADO"])
            except ValueError as e:
                rechazadas.append({"linea": n, "motivo": str(e)})
                continue

            for col in COLUMNAS_TEXTO:
                if limpio[col] and RE_CODIF.search(limpio[col]):
                    stats["textos_con_posible_error_de_codificacion"] += 1
                    break

            if valor < 0:
                stats["valores_negativos"] += 1
            elif valor == 0:
                stats["valores_cero"] += 1

            clave = hash(tuple(fila))
            if clave in vistos:
                stats["filas_duplicadas_exactas"] += 1
            vistos.add(clave)

            if limpio["PROVINCIA"] and limpio["CANTON"]:
                canton_provincias[limpio["CANTON"]][limpio["PROVINCIA"]] += 1

            registros.append({
                "ANIO": anio,
                "MES": mes,
                "MES_NOMBRE": mes_nombre,
                "GRUPO_IMPUESTO": limpio["GRUPO_IMPUESTO"],
                "SUBGRUPO_IMPUESTO": limpio["SUBGRUPO_IMPUESTO"],
                "IMPUESTO": limpio["IMPUESTO"],
                "GRAN_CONTRIBUYENTE": limpio["GRAN_CONTRIBUYENTE"],
                "CODIGO_OPERA_FAMILIA": limpio["CODIGO_OPERA_FAMILIA"],
                "TIPO_CONTRIBUYENTE": limpio["TIPO_CONTRIBUYENTE"],
                "PROVINCIA": limpio["PROVINCIA"],
                "CANTON": limpio["CANTON"],
                "VALOR_RECAUDADO": round(valor, 4),
            })

    # Cantones que aparecen bajo más de una provincia (posible inconsistencia de la fuente)
    cantones_multiples = {
        c: dict(p) for c, p in canton_provincias.items() if len(p) > 1
    }
    return registros, rechazadas, stats, cantones_multiples, enc


def escribir_json(ruta, registros, pretty):
    """Escribe el JSON. Sin --pretty va un registro por línea (sigue siendo JSON válido),
    lo que permite validarlo después leyendo línea a línea sin cargarlo todo en memoria."""
    with open(ruta, "w", encoding="utf-8") as f:
        if pretty:
            json.dump(registros, f, ensure_ascii=False, indent=2)
            return
        f.write("[\n")
        for i, r in enumerate(registros):
            if i:
                f.write(",\n")
            f.write(json.dumps(r, ensure_ascii=False, separators=(",", ":")))
        f.write("\n]\n")


def validar_json(ruta_json, esperados, pretty):
    """Comprueba el JSON en disco: estructura, cantidad de registros y tipos.
    Sin --pretty lo lee línea a línea (memoria constante); con --pretty usa json.load
    (pensado para muestras pequeñas)."""
    campos = set(COLUMNAS) | {"MES_NOMBRE"}
    errores, tipos = [], Counter()
    n = 0
    campos_mal = False

    def err(msg):
        if msg not in errores:
            errores.append(msg)

    def revisar(r):
        nonlocal n, campos_mal
        n += 1
        if set(r.keys()) != campos:
            campos_mal = True
            return
        if not isinstance(r["ANIO"], int) or not isinstance(r["MES"], int):
            tipos["ANIO/MES"] += 1
        elif not 1 <= r["MES"] <= 12:
            tipos["MES fuera de rango"] += 1
        v = r["VALOR_RECAUDADO"]
        if not isinstance(v, (int, float)) or isinstance(v, bool):
            tipos["VALOR_RECAUDADO"] += 1
        for c in COLUMNAS_TEXTO + ["MES_NOMBRE"]:
            if r[c] is not None and not isinstance(r[c], str):
                tipos[c] += 1

    try:
        with open(ruta_json, encoding="utf-8") as f:
            if pretty:
                datos = json.load(f)
                if not isinstance(datos, list):
                    err("La raíz del JSON no es una lista")
                else:
                    for r in datos:
                        revisar(r)
            else:
                if f.readline().strip() != "[":
                    err("El archivo no empieza con '['")
                previa, cerrado = None, False
                for linea in f:
                    linea = linea.strip()
                    if not linea:
                        continue
                    if linea == "]":
                        cerrado = True
                        if previa is not None:
                            if previa.endswith(","):
                                err("Coma sobrante tras el último registro")
                            revisar(json.loads(previa.rstrip(",")))
                        break
                    if previa is not None:
                        if not previa.endswith(","):
                            err("Falta una coma entre registros")
                        revisar(json.loads(previa.rstrip(",")))
                    previa = linea
                if not cerrado:
                    err("Falta el ']' final")
    except json.JSONDecodeError as e:
        err(f"JSON mal formado: {e}")

    if n != esperados:
        err(f"Cantidad de registros distinta: JSON={n} esperado={esperados}")
    if campos_mal:
        err("Hay registros con campos distintos a los esperados")
    if tipos:
        err(f"Tipos incorrectos: {dict(tipos)}")
    return {"valido": not errores, "registros_en_json": n, "errores": errores}


def main():
    p = argparse.ArgumentParser(description="Transforma el CSV del SRI a JSON validado.")
    p.add_argument("entrada", help="Ruta del CSV de entrada")
    p.add_argument("salida", help="Ruta del JSON de salida")
    p.add_argument("--delimiter", default="|", help="Separador de columnas (por defecto '|')")
    p.add_argument("--encoding", default="utf-8", help="Codificación del CSV (por defecto utf-8)")
    p.add_argument("--pretty", action="store_true", help="JSON con sangría (archivo más grande)")
    a = p.parse_args()

    registros, rechazadas, stats, cantones_multiples, enc = transformar(
        a.entrada, a.delimiter, a.encoding
    )

    escribir_json(a.salida, registros, a.pretty)

    chequeo = validar_json(a.salida, len(registros), a.pretty)

    reporte = {
        "archivo_entrada": a.entrada,
        "archivo_salida": a.salida,
        "codificacion_usada": enc,
        "filas_leidas": stats["filas_leidas"],
        "registros_validos": len(registros),
        "filas_rechazadas": len(rechazadas),
        "detalle_rechazadas": rechazadas[:50],
        "valores_vacios_por_columna": dict(stats["valores_vacios_por_columna"]),
        "valores_cero": stats["valores_cero"],
        "valores_negativos": stats["valores_negativos"],
        "filas_duplicadas_exactas": stats["filas_duplicadas_exactas"],
        "textos_con_espacios_corregidos": stats["textos_con_espacios_corregidos"],
        "filas_con_posible_error_de_codificacion": stats["textos_con_posible_error_de_codificacion"],
        "cantones_en_mas_de_una_provincia": dict(list(cantones_multiples.items())[:30]),
        "total_cantones_en_mas_de_una_provincia": len(cantones_multiples),
        "valores_distintos": {
            c: len({r[c] for r in registros}) for c in
            ["MES", "GRUPO_IMPUESTO", "IMPUESTO", "TIPO_CONTRIBUYENTE", "PROVINCIA", "CANTON"]
        },
        "suma_valor_recaudado": round(sum(r["VALOR_RECAUDADO"] for r in registros), 2),
        "validacion_json": chequeo,
    }
    ruta_reporte = re.sub(r"\.json$", "", a.salida) + "_reporte_validacion.json"
    with open(ruta_reporte, "w", encoding="utf-8") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)

    print(f"Filas leídas:        {stats['filas_leidas']}")
    print(f"Registros válidos:   {len(registros)}")
    print(f"Filas rechazadas:    {len(rechazadas)}")
    print(f"Valores vacíos:      {dict(stats['valores_vacios_por_columna']) or 'ninguno'}")
    print(f"Duplicados exactos:  {stats['filas_duplicadas_exactas']}")
    print(f"Cantones en >1 provincia: {len(cantones_multiples)}")
    print(f"Validación del JSON: {'OK' if chequeo['valido'] else 'CON ERRORES -> ' + str(chequeo['errores'])}")
    print(f"JSON:    {a.salida}")
    print(f"Reporte: {ruta_reporte}")
    sys.exit(0 if chequeo["valido"] else 1)


if __name__ == "__main__":
    main()
