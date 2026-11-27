# Sprint 3 – Conexión de React con Firebase para recuperar información

## Texto para la Plantilla_Reporte

Se utilizó Firebase Realtime Database como repositorio central de datos. A
partir de los 665 184 registros del JSON generado durante Sprint 1, el script
`scripts/preparar_firebase.py` produjo 24 423 combinaciones agrupadas por año,
mes, grupo/impuesto, provincia y tipo de contribuyente. Su suma es
USD 20 131 290 047,53, coincidente con el reporte de validación de Sprint 1.
Se importó el archivo derivado como `/recaudacion_2024`. La preagregación evita
cargar el JSON original de más de 200 MB en el navegador.

El módulo `src/services/firebase.ts` centraliza la configuración web de Firebase
y obtiene el nodo mediante `get(ref(getDatabase(app), 'recaudacion_2024'))`.
`src/services/records.ts` valida los registros recibidos. El hook
`src/hooks/useTaxRecords.ts` emplea `useEffect` al montar el componente y
`useState` para guardar registros, carga y error. `DashboardPage` consume ese
hook y alimenta filtros, indicadores, gráficos y detalle con los datos
recuperados, no con el mock del Sprint 2.

```tsx
const [state, setState] = useState<Omit<RecordsState, 'source'>>({
  records: [], loading: true, error: null,
})

useEffect(() => {
  let active = true
  async function load() {
    try {
      const records = source === 'firebase'
        ? await import('../services/firebase').then(({ loadFirebaseRecords }) => loadFirebaseRecords())
        : parseRecords(sample)
      if (active) setState({ records, loading: false, error: null })
    } catch (error) {
      if (active) setState({
        records: [],
        loading: false,
        error: error instanceof Error ? error.message : 'No se pudieron cargar los datos.',
      })
    }
  }
  void load()
  return () => { active = false }
}, [source])
```

Fragmento del hook `useTaxRecords.ts` (se omite solo la línea de limpieza
`return () => { active = false }`, que aparece al final del archivo).

Repositorio: https://github.com/luri234/Dashboard_Tributario
SHA de integración de Sprint 3 en `main`: `1693cd87f8547bdae081475c41eab3f2d4d8d40a`

## Capturas que debe hacer el equipo

1. **Firebase:** abre https://console.firebase.google.com/ → proyecto
   DashboardTributario → **Realtime Database** → **Datos**. Expande
   `/recaudacion_2024` y una fila (`0`, `1`, etc.). Toma una captura donde se
   lean el nombre del nodo y al menos `ANIO`, `MES`, `PROVINCIA`,
   `TIPO_CONTRIBUYENTE` y `VALOR_RECAUDADO`. No fotografíes reglas, tokens ni
   `.env.local`.
2. **Código:** abre `src/hooks/useTaxRecords.ts` en VS Code y amplía el editor
   hasta que se vean juntos `useState`, `useEffect`, la consulta con
   `loadFirebaseRecords()` y las ramas de éxito/error. En otra captura pequeña
   muestra `src/services/firebase.ts` con `get(...)` y la ruta del nodo.
3. **React:** abre la URL desplegada o `npm run dev` con
   `VITE_DATA_SOURCE=firebase`. Espera a que desaparezca «Cargando…». Captura
   título, insignia **Datos desde Firebase**, filtros y KPI de recaudación
   total. Cambia **Provincia** a Pichincha y toma otra captura que evidencie
   cambio de valor y de gráfica mensual. No uses la insignia «Muestra local»
   como prueba de conexión.
4. **Git:** tras integrar Sprint 3, abre la pestaña Commits de GitHub y copia
   el SHA exacto del commit correspondiente en la sección del reporte.

Para la evidencia **móvil**, DevTools → barra de dispositivos → **Responsive**
→ ancho **390** y alto **844**. Esa es la medida de la ventana, no de toda la
página: el dashboard continúa verticalmente y es normal desplazarse para ver
gráficos y detalle. En el menú de DevTools (**⋮**) elige
**Capture a full size screenshot** para obtener una sola imagen de toda la
página (su altura será mayor que 844 px). Si se exigen capturas de exactamente
390 × 844, toma varias vistas al desplazarte y numéralas como parte superior,
gráficos y detalle; no las presentes como una sola captura completa.

## Comprobaciones antes de capturar

- La base responde con 24 423 combinaciones y datos para los doce meses.
- La aplicación muestra **Datos desde Firebase**, no **Muestra local**.
- No se suben `.env.local`, el JSON auxiliar ni capturas con credenciales al repo.
