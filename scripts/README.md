# CSV a JSON: Recaudación de Impuestos (SRI Ecuador)

Script en Python que convierte el archivo CSV de recaudación de impuestos del Servicio de Rentas Internas (SRI) de Ecuador en un archivo JSON limpio, con los tipos de datos correctos, listo para usarse en una aplicación web o cargarse en una base de datos.

Datos de origen: [Recaudación de impuestos 2024 - Datos Abiertos Ecuador](https://www.datosabiertos.gob.ec/dataset/recaudacion-de-impuestos-2024)

## Qué hace el script

1. Lee el CSV (columnas separadas por `|`).
2. Limpia los textos: elimina espacios sobrantes al inicio, al final y en medio.
3. Convierte cada campo al tipo correcto: números como números y textos como texto.
4. Separa el mes (`"12 Diciembre"`) en un número (`12`) y un nombre (`"Diciembre"`).
5. Descarta las filas dañadas (columnas faltantes, números inválidos) y las registra en un reporte.
6. Genera el archivo JSON.
7. Vuelve a leer el JSON generado para comprobar que está bien formado, que tiene todos los registros y que los tipos son correctos.

## Requisitos

- Python 3.8 o superior.
- No hay que instalar ninguna librería.

## Cómo usarlo

Desde una terminal, indica el CSV de entrada y el nombre del JSON de salida:

```bash
python scripts/csv_a_json.py data/recaudacion_2024.csv data/recaudacion_2024.json
```

En Windows, si `python` no funciona, usa `py` en su lugar.

Opciones disponibles:

| Opción | Para qué sirve |
|---|---|
| `--pretty` | Genera el JSON con sangría para que sea fácil de leer. Se usa solo con archivos pequeños. |
| `--delimiter ","` | Cambia el separador de columnas (por defecto es `\|`). |
| `--encoding latin-1` | Cambia la codificación del CSV (por defecto es `utf-8`). |

## Qué entrega

Al terminar, el script crea dos archivos y muestra un resumen en pantalla:

- **El JSON** (por ejemplo `recaudacion_2024.json`): una lista con un objeto por cada fila del CSV.
- **Un reporte de validación** (por ejemplo `recaudacion_2024_reporte_validacion.json`): cuántas filas se leyeron, cuántas fueron válidas o rechazadas, valores vacíos, ceros, duplicados y otros hallazgos sobre la calidad de los datos.

### Ejemplo de registro

```json
{
  "ANIO": 2024,
  "MES": 12,
  "MES_NOMBRE": "Diciembre",
  "GRUPO_IMPUESTO": "IMPUESTO AL VALOR AGREGADO",
  "SUBGRUPO_IMPUESTO": "IVA OPERACIONES INTERNAS",
  "IMPUESTO": "IVA MENSUAL",
  "GRAN_CONTRIBUYENTE": "NO",
  "CODIGO_OPERA_FAMILIA": "K",
  "TIPO_CONTRIBUYENTE": "SOCIEDADES",
  "PROVINCIA": "COTOPAXI",
  "CANTON": "LATACUNGA",
  "VALOR_RECAUDADO": 51067.9
}
```

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `ANIO` | número | Año de la recaudación |
| `MES` | número | Mes (1 a 12) |
| `MES_NOMBRE` | texto | Nombre del mes |
| `GRUPO_IMPUESTO`, `SUBGRUPO_IMPUESTO`, `IMPUESTO` | texto | Clasificación del tributo, de lo general a lo específico |
| `GRAN_CONTRIBUYENTE` | texto | Si corresponde a un gran contribuyente (`NO` si no lo es) |
| `CODIGO_OPERA_FAMILIA` | texto | Sector de actividad económica (CIIU 4.0, nivel 1) |
| `TIPO_CONTRIBUYENTE` | texto | Personas naturales, sociedades o `NO TIENE` |
| `PROVINCIA`, `CANTON` | texto | Lugar donde se recaudó el tributo |
| `VALOR_RECAUDADO` | número | Valor recaudado en dólares |

## Notas sobre los datos

- `NO TIENE` es una categoría válida de la fuente (contribuyentes no registrados en el RUC), no un dato faltante. Se conserva como texto.
- Los valores en cero son legítimos y se conservan.
- El script no corrige inconsistencias de la fuente (por ejemplo, un cantón que aparece bajo una provincia que no le corresponde). Solo las informa en el reporte.

