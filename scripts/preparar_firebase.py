#!/usr/bin/env python3
"""Preagrega el JSON generado por csv_a_json.py sin modificar el original."""
import argparse
import itertools
import json
from collections import defaultdict
from decimal import Decimal
from pathlib import Path

FIELDS = (
    "ANIO", "MES", "MES_NOMBRE", "GRUPO_IMPUESTO",
    "IMPUESTO", "PROVINCIA", "TIPO_CONTRIBUYENTE",
)


def records(path):
    """Lee por líneas el dataset grande; admite muestras pequeñas con sangría."""
    with path.open(encoding="utf-8") as source:
        if source.readline().strip() != "[":
            raise ValueError("Se esperaba un array JSON")
        first = source.readline()
        if first.strip() == "{":
            source.seek(0)
            yield from json.load(source)
            return
        for line in itertools.chain([first], source):
            item = line.strip().rstrip(",")
            if not item or item == "]":
                continue
            yield json.loads(item)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("entrada", type=Path, help="JSON original generado por csv_a_json.py")
    parser.add_argument("salida", type=Path, help="JSON preagregado para importar en Firebase")
    args = parser.parse_args()
    if args.entrada.resolve() == args.salida.resolve():
        parser.error("La salida debe ser distinta del JSON original.")
    if args.salida.exists():
        parser.error("La salida ya existe; elige otra ruta para no sobrescribir datos.")

    totals = defaultdict(Decimal)
    for row in records(args.entrada):
        key = tuple(row[field] for field in FIELDS)
        totals[key] += Decimal(str(row["VALOR_RECAUDADO"]))

    # El origen guarda valores con hasta cuatro decimales.
    with args.salida.open("w", encoding="utf-8") as output:
        output.write("[\n")
        for index, (key, value) in enumerate(sorted(totals.items())):
            if index:
                output.write(",\n")
            result = dict(zip(FIELDS, key))
            result["VALOR_RECAUDADO"] = float(round(value, 4))
            output.write(json.dumps(result, ensure_ascii=False))
        output.write("\n]\n")
    print(f"{len(totals)} combinaciones guardadas en {args.salida}")


if __name__ == "__main__":
    main()
