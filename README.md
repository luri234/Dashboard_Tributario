# Dashboard Tributario 2024

Dashboard académico en React, TypeScript y Material UI con datos abiertos del
Servicio de Rentas Internas de Ecuador. Los datos se consultan desde Firebase
Realtime Database y se filtran sin recargar la página.

## Desarrollo local

```powershell
npm ci
Copy-Item .env.example .env.local
notepad .env.local
npm run dev
```

En `.env.local`, configura `VITE_DATA_SOURCE=firebase` y completa las variables
`VITE_FIREBASE_*` de la aplicación web en Firebase. Vite debe reiniciarse al
modificar el archivo. La página muestra **Datos desde Firebase** al usar la base,
o **Muestra local** si `VITE_DATA_SOURCE=local`. La muestra se importa de
`data/muestra.json` y **no** representa el total nacional. Nunca se sube
`.env.local` a Git.

La app lee `/recaudacion_2024` una vez al cargar. Esta ruta contiene **24 423
combinaciones preagregadas** derivadas de los **665 184 registros** del JSON
original de Sprint 1. Así se evita enviar más de 200 MB al navegador. La
preagregación se genera sin modificar los datos originales:

```powershell
python scripts/preparar_firebase.py data/recaudacion_2024.json recaudacion_firebase.json
```

Importa el resultado dentro del nodo `/recaudacion_2024` de Realtime Database;
no lo añadas al repositorio. Los importes se almacenan en USD y se convierten
a millones únicamente para mostrarlos. Las reglas de Firebase determinan quién
puede leer el nodo; la configuración web no es una credencial de administrador.

## Verificación y entrega

```powershell
npm run lint
npm test
npm run build
```

Consulta [docs/SPRINT3_EVIDENCIAS.md](docs/SPRINT3_EVIDENCIAS.md) para las
capturas y el texto de la sección de Firebase en el reporte.

El workflow `.github/workflows/deploy.yml` compila desde `main` y publica
`dist/` en la rama `gh-pages`, que es la fuente actual de GitHub Pages. Necesita
permiso de escritura para GitHub Actions y los cinco secretos `VITE_FIREBASE_*`
indicados en `.env.example`.
Esas variables forman parte del cliente web compilado, no son claves de
administrador. Sitio: https://luri234.github.io/Dashboard_Tributario/
