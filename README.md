# Dashboard Tributario 2024 — Entrega 1

Prototipo de componentes e interfaces de Sprint 2, creado con React,
TypeScript y Material UI. Los indicadores y visualizaciones usan exclusivamente
datos ficticios (`src/mocks/dashboard.ts`); **no son cifras oficiales del SRI**.

Vista publicada: https://luri234.github.io/Dashboard_Tributario/
El contenido publicado se encuentra en la rama `gh-pages`; este repositorio
no tiene todavía un flujo de despliegue automático desde `main`.

```powershell
npm ci
npm run dev
```

En el navegador, cambia Provincia, Tipo de contribuyente o Mes: el estado
compartido actualiza los indicadores, gráficos y detalle sin recargar la página.
En DevTools, prueba también una anchura inferior a 768 px: los filtros,
indicadores y gráficos se apilan, y el detalle cambia de tabla a tarjetas.

```powershell
npm run lint
npm run build
```

Esta entrega no carga el JSON completo ni se conecta a Firebase. Los datos
reales, la preagregación y la carga remota se incorporarán en entregas futuras.
