# Metafar Challenge

Aplicación React + TypeScript para visualizar acciones y consultar series de precios usando Twelve Data. El foco de esta entrega fue refactorizar el manejo de datos con TanStack Query, mejorar performance donde correspondía y dejar documentadas las decisiones importantes.

## Setup

Instalar dependencias:

```bash
yarn install
```

Crear un `.env` local:

```bash
VITE_TWELVE_DATA_API_KEY=tu_api_key
```

El `.env` local está ignorado por Git. `.env.example` queda como referencia sin secretos.

Scripts principales:

```bash
yarn dev
yarn lint
yarn test
yarn test:coverage
yarn build
```

## Stack actual

- React 18 + TypeScript + Vite.
- TanStack Query para manejo de data + cache.
- Axios.
- React Router.
- Base UI + Tailwind.
- Highcharts para gráficos.
- Vitest + React Testing Library para tests.

## Arquitectura

Separé la capa de datos de los componentes conforme a la estructura solicitada:

```text
src/
  api/
    client.ts
    endpoints.ts
    queryClient.ts
    stocks.ts
    quotes.ts
    guards.ts
    types.ts
  hooks/
    queries/
      cacheConfig.ts
      queryKeys.ts
      useStockList.ts
      useStockData.ts
      useStockQuote.ts
      useStockSearch.ts
  components/
    atomics/
    ui/
    Detail.tsx
    StockChart.tsx
    StockPreferenceForm.tsx
    StockTable.tsx
```

## TanStack Query

Estrategia de cache:

- Lista de acciones: `staleTime: Infinity` y `gcTime` de un día.
- Metadata de una acción: `staleTime` de una hora y `gcTime` largo.
- Serie histórica: `staleTime` de cinco minutos y query key parametrizada por símbolo, intervalo y fechas.
- Tiempo real: `staleTime: 0` y `refetchInterval` dinámico según el intervalo elegido.

No usamos `localStorage`. El enunciado lo mencionaba para datos estáticos, pero en esta app la cache de React Query durante la sesión cubre el caso principal sin sumar serialización, invalidación manual ni una dependencia extra. Si el producto necesitara persistencia entre sesiones u offline, lo agregaría como una decisión específica.

Prefetch, invalidación y cancelación:

- Al hacer hover sostenido sobre una fila, se prefetchea la metadata de esa acción.
- En el mismo gesto se pre-carga el chunk de detalle.
- El botón de reintento invalida la query de lista de acciones.
- Las query functions reciben el `AbortSignal` de React Query y lo pasan a Axios.
- La deduplicación queda delegada a React Query.

## Búsqueda remota

El hook `useStockSearch` quedó comentado a propósito. La tabla filtra localmente sobre la lista NASDAQ ya cargada, así evitamos llamadas remotas extra para una búsqueda que hoy no aporta más valor al flujo principal.

La función API `searchStocks` y el endpoint `symbol_search` quedan disponibles si más adelante se decide conectar una búsqueda remota real. Para esta entrega, no usamos ese hook.

## API, tipos y runtime safety

La API ahora entra por funciones tipadas:

- `getStockList`
- `getStockData`
- `searchStocks`
- `getStockQuote`

Las respuestas remotas se tratan como `unknown` antes de validarlas. Esto evita confiar ciegamente en generics de Axios para datos que vienen de afuera.

Agregué type guards livianos para:

- Lista de acciones.
- Búsqueda de símbolos.
- Time series.

No agregué Zod, ya que los contratos usados son chicos y el valor de una dependencia nueva no compensaba el peso conceptual. Si la app crece o aparecen más endpoints, Zod pasaría a ser viable.

TypeScript está en `strict` y no hay `any` explícitos. Los errores externos siguen entrando como `unknown` y se normalizan antes de mostrarlos al usuario.

## Performance

Optimizaciones aplicadas:

- Virtualización con `@tanstack/react-virtual`.
- Scroll incremental client-side en lotes de 100 acciones.
- `React.lazy` para separar la ruta de detalle.
- `React.lazy` para sacar Highcharts del bundle inicial.
- `React.memo` en la fila virtual y el gráfico.
- `useMemo` para filtrado, slice visible y opciones de Highcharts.
- `useCallback` para el prefetch de filas.
- Sampling simple del gráfico hasta 1000 puntos.
- Highcharts Boost dentro del chunk lazy del gráfico como red de seguridad.
- `keepPreviousData` en la query de precios para transiciones más suaves.

Trade-off de la tabla: la API devuelve la lista completa, así que no hay paginado real de servidor. El infinite scroll es client-side. No reduce la transferencia inicial, pero sí mantiene bajo el número de nodos montados y el costo de render cuando hay miles de acciones.

Trade-off del gráfico: preferí sampling simple antes que meter una estrategia más compleja de agrupamiento. Para este challenge alcanza porque evita renders pesados con series grandes sin convertir el gráfico en otro proyecto. Boost queda habilitado cuando la serie original supera el límite.

Métricas registradas:

- Antes del split había un único JS principal de alrededor de 705 kB, gzip alrededor de 247 kB.
- Build actual:
  - `index`: 441.52 kB, gzip 147.10 kB.
  - `Detail`: 12.83 kB, gzip 5.15 kB.
  - `StockChart`: 319.44 kB, gzip 114.18 kB.
- En la revisión post-virtualización, con miles de acciones filtradas, se observaron cientos de nodos DOM y no miles.

La evidencia incluida es build size, separación de chunks, revisión DOM post-virtualización y tests. Si se quisiera una entrega más ceremonial, el siguiente paso sería adjuntar capturas de Lighthouse y React Profiler.

## UX y manejo de errores

La UX ahora usa estados de React Query:

- Skeleton para carga inicial de la tabla.
- Mensaje de actualización en background.
- Error inline cerca del contexto donde falla.
- Toasts para errores y acciones relevantes.
- ErrorBoundary con `react-error-boundary` y `QueryErrorResetBoundary`.
- Modo tiempo real con indicador y acción de pausar/reanudar.
- Responsive básico en listado y formulario.

Los mensajes para usuario están centralizados y son genéricos. La app no muestra detalles del proveedor ni errores técnicos en UI. En desarrollo se loguea más información para debug.

También se unificaron controles con Base UI:

- Inputs de texto y fecha.
- Radio buttons.
- Select de intervalo.
- Botones a través de un wrapper local sobre `@base-ui/react/button`.
- Toasts.

## Testing

Se agregó:

- Vitest + React Testing Library.
- `jsdom`.
- Helper de render con `QueryClient` aislado por test.
- Coverage con provider `v8`.

Suite actual:

- `src/api/client.test.ts`: API key, parseo de respuestas y errores amigables.
- `src/api/guards.test.ts`: contratos runtime de respuestas.
- `src/hooks/queries/useStockQuote.test.tsx`: parámetros, query deshabilitada, cache histórica y refetch realtime.
- `src/components/StockTable.test.tsx`: skeleton, error, retry, filtrado y prefetch por hover sostenido.
- `src/components/StockPreferenceForm.test.tsx`: metadata, submit histórico, error y pausa de realtime.
- `src/components/Detail.test.tsx`: render condicional del gráfico, pausa y skeleton inicial.

Resultado actual:

- `yarn lint`: pasa.
- `yarn test`: 6 archivos, 25 tests, todos pasando.
- `yarn build`: pasa.
- `yarn test:coverage`: coverage focalizado de 83% statements, 86.18% branches, 84.48% functions y 82.78% lines.

No agregué E2E ni tests internos de Highcharts. Preferí cubrir contratos de API, hooks críticos y flujos visibles.

## Estado frente a entregables

Cumplido:

- Código refactorizado y funcional.
- TanStack Query implementado en los flujos principales.
- `QueryClient` con defaults, retries, `staleTime` y `gcTime`.
- Capa API separada de componentes.
- Hooks para lista, detalle de acción y quote.
- Cache por tipo de dato.
- Prefetch en hover sostenido e invalidación para reintento.
- Cancelación con `AbortSignal`.
- Uso de estados de React Query: loading, fetching, error y datos previos.
- Tabla virtualizada.
- Code splitting de detalle y gráfico.
- Optimización del gráfico para datasets grandes.
- UX mejorada con loading, errores, background fetching, toasts y ErrorBoundary.
- TypeScript estricto, tipos de API y validación runtime liviana.
- Tests y coverage sobre código crítico.
- Commits incrementales y descriptivos.
- README actualizado como documento de entrega.

Decisiones intencionales:

- No se usa `localStorage`.
- No se usa `useStockSearch`; quedó comentado porque la búsqueda actual es local.
- No hay invalidación optimista porque no hay escrituras.
- No hay `src/services` porque `src/api` alcanzaba para lo solicitado.
- No hay reporte formal versionado de Lighthouse o React Profiler.

## Próximos pasos

1. Adjuntar capturas o reportes de Lighthouse y React Profiler si se quiere cerrar la parte de métricas de forma más formal.
2. Eliminar definitivamente `useStockSearch.ts` si más adelante confirmamos que nunca habrá búsqueda remota.
3. Evaluar Zod solo si aparecen más endpoints o contratos más complejos.
