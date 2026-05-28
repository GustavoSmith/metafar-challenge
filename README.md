# Challenge: Mejora y Optimización de Aplicación de Mercado de Valores

## 📋 Contexto del Proyecto

Este proyecto es una aplicación React + TypeScript que permite visualizar y analizar datos del mercado de valores utilizando la API de [Twelve Data](https://twelvedata.com/docs#overview). La aplicación actualmente incluye:

### Funcionalidades Actuales

- **Tabla de acciones**: Listado de acciones con búsqueda por nombre y símbolo, paginación
- **Vista de detalle**: Página de detalle por acción con gráfico de precios
- **Configuración de visualización**: Formulario para seleccionar intervalo temporal (5min, 15min, 1h, etc.) y rango de fechas
- **Modo tiempo real e histórico**: Opción para ver datos en tiempo real o históricos

### Stack Tecnológico Actual

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Material-UI (MUI)
- **Gráficos**: Highcharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

### API Utilizada: Twelve Data

La aplicación utiliza la API de Twelve Data que ofrece:

- **Time Series**: Datos históricos y en tiempo real con múltiples intervalos
- **Quote**: Precios actuales de acciones
- **WebSocket**: Streaming de datos en tiempo real (disponible en planes Pro+)
- **Symbol Search**: Búsqueda de instrumentos financieros
- **Reference Data**: Metadatos de acciones, exchanges, etc.
- **Technical Indicators**: Más de 100 indicadores técnicos
- **Fundamentals**: Datos fundamentales de empresas

**Documentación completa**: https://twelvedata.com/docs#overview

---

## 🎯 Objetivo del Challenge

Tu tarea es **refactorizar la arquitectura** de esta aplicación implementando **React Query (TanStack Query)** para la gestión de datos del servidor y aplicar **mejoras de rendimiento** significativas. El enfoque principal está en:

1. **Arquitectura moderna** con React Query para gestión de estado del servidor
2. **Optimización de rendimiento** con técnicas avanzadas de React
3. **Mejora de la experiencia de usuario** con mejor manejo de estados de carga y errores

**Tiempo estimado**: 8-12 horas (puede distribuirse en varios días)

---

## 🚀 Desafíos Principales

### 1. Refactorización Arquitectónica con React Query (4-5 horas)

#### Situación Actual

- Estado local en componentes sin gestión centralizada
- Lógica de negocio mezclada con componentes
- No hay caché de datos
- Múltiples llamadas redundantes a la API
- Manejo manual de estados de loading y error
- No hay invalidación inteligente de caché

#### Tareas Obligatorias

- [ ] **Instalar y configurar React Query (TanStack Query)**
  - Instalar `@tanstack/react-query` y `@tanstack/react-query-devtools`
  - Configurar `QueryClient` con opciones apropiadas:
    - `defaultOptions` para queries y mutations
    - `staleTime` y `cacheTime` según el tipo de dato
    - Configurar `retry` con exponential backoff
    - Habilitar React Query DevTools en desarrollo

- [ ] **Refactorizar capa de servicios/API**
  - Crear una estructura clara de servicios (`src/services/` o `src/api/`)
  - Abstraer todas las llamadas a Twelve Data en funciones de servicio
  - Implementar tipos TypeScript completos para todas las respuestas de la API
  - Crear tipos para los parámetros de cada endpoint
  - Organizar servicios por dominio (stocks, quotes, search, etc.)

- [ ] **Crear custom hooks con React Query**
  - `useStockList()` - Para obtener lista de acciones
  - `useStockQuote(symbol, interval, startDate, endDate)` - Para datos de time series
  - `useStockData(symbol)` - Para información básica de una acción
  - `useStockSearch(query)` - Para búsqueda de símbolos (con debouncing)
  - Cada hook debe exponer: `data`, `isLoading`, `isError`, `error`, `refetch`

- [ ] **Configurar estrategias de caché**
  - **Datos estáticos** (lista de acciones): `staleTime: Infinity`, persistir en localStorage
  - **Datos históricos**: `staleTime: 5 minutos` (no cambian)
  - **Datos en tiempo real**: `staleTime: 0`, `refetchInterval` según intervalo seleccionado
  - **Búsquedas**: `staleTime: 1 minuto`, caché corto

- [ ] **Implementar prefetching inteligente**
  - Prefetch datos de acciones al hacer hover sobre filas de la tabla
  - Prefetch datos relacionados cuando se navega a una página de detalle
  - Usar `queryClient.prefetchQuery()` estratégicamente

- [ ] **Manejo de invalidación de caché**
  - Invalidar caché cuando sea necesario
  - Usar `queryClient.invalidateQueries()` apropiadamente
  - Implementar invalidación optimista donde sea posible

- [ ] **Request deduplication y cancelación**
  - Aprovechar la deduplicación automática de React Query
  - Implementar cancelación de queries cuando el componente se desmonta
  - Cancelar queries anteriores cuando cambian los parámetros

**Entregables**:

- Código refactorizado con React Query implementado
- Documento explicando:
  - Estrategia de caché para cada tipo de dato
  - Trade-offs de las decisiones tomadas

#### Ejemplo de Estructura Esperada

```
src/
├── api/
│   ├── client.ts          # Axios instance configurado
│   ├── endpoints.ts       # Constantes de endpoints
│   └── types.ts           # Tipos de la API
├── services/
│   ├── stockService.ts    # Funciones de servicio para stocks
│   └── quoteService.ts    # Funciones de servicio para quotes
├── hooks/
│   ├── queries/
│   │   ├── useStockList.ts
│   │   ├── useStockQuote.ts
│   │   ├── useStockData.ts
│   │   └── useStockSearch.ts
│   └── useDebounce.ts    # Hook existente
├── components/
│   └── ...
└── App.tsx               # QueryClientProvider aquí
```

---

### 2. Optimización de Performance (3-4 horas)

#### Situación Actual

- Tabla renderiza todos los elementos sin virtualización (puede ser lenta con muchos datos)
- No hay code splitting (todo se carga al inicio)
- Re-renders innecesarios en componentes
- Bundle size no optimizado
- Gráfico puede ser lento con grandes datasets
- No hay memoización de componentes costosos

#### Tareas Obligatorias

- [ ] **Virtualización de tabla**
  - Implementar virtualización para `StockTable` usando `react-window` o `@tanstack/react-virtual`
  - Mantener funcionalidad de paginación o adaptarla a scroll virtual
  - Medir mejora de performance (FPS, tiempo de render inicial)

- [ ] **Code splitting y lazy loading**
  - Implementar lazy loading de rutas con `React.lazy()` y `Suspense`
  - Separar `Detail` component (página de detalle) en un chunk separado
  - Separar `StockChart` (Highcharts es pesado) en un chunk separado
  - Implementar preloading de rutas al hacer hover sobre links

- [ ] **Optimización de re-renders**
  - Usar **React DevTools Profiler** para identificar componentes que se re-renderizan innecesariamente
  - Implementar `React.memo` en componentes que reciben props que no cambian frecuentemente:
    - `TableRow` - memoizar para evitar re-renders al cambiar filtros
    - `StockChart` - memoizar para evitar re-renders cuando datos no cambian
    - Componentes atómicos que no necesitan re-renderizarse
  - Usar `useMemo` para cálculos costosos:
    - Filtrado de stocks en `StockTable`
    - Transformación de datos para el gráfico
  - Usar `useCallback` para funciones pasadas como props:
    - Handlers en `StockTable` y `StockPreferenceForm`
  - **Documentar** cada optimización: por qué se hizo y qué problema resuelve

- [ ] **Optimización del gráfico**
  - Optimizar renderizado de Highcharts:
    - Limitar cantidad de puntos mostrados (data sampling para datasets grandes)
    - Implementar `dataGrouping` de Highcharts para datasets grandes
    - Usar `boost` module de Highcharts si hay muchos puntos
  - Implementar lazy loading del gráfico (solo cargar cuando se necesita)
  - Considerar renderizado progresivo para datos históricos extensos

- [ ] **Optimizaciones adicionales de React Query**
  - Configurar `structuralSharing: true` en QueryClient (ya viene por defecto)
  - Usar `keepPreviousData: true` para transiciones suaves entre queries
  - Implementar `placeholderData` para mejor UX durante carga
  - Optimizar `select` en queries para transformar datos solo cuando sea necesario

**Entregables**:

- Métricas de performance documentadas:
  - Lighthouse scores (Performance, First Contentful Paint, Time to Interactive)
  - React Profiler: tiempo de render, cantidad de re-renders
  - Tiempo de carga inicial
- Documentación de optimizaciones:
  - Lista de optimizaciones implementadas
  - Métricas de mejora (ej: "Bundle reducido de 2.5MB a 1.8MB")
  - Justificación de cada optimización

---

### 3. Mejora de UX con React Query (1-2 horas)

#### Situación Actual

- Manejo básico de errores
- Estados de loading poco informativos
- No hay feedback visual para acciones del usuario
- ErrorBoundary básico

#### Tareas

- [ ] **Aprovechar estados de React Query**
  - Usar `isLoading`, `isFetching`, `isError`, `error` de React Query en componentes
  - Mostrar estados de loading específicos por sección
  - Implementar skeleton loaders donde sea apropiado
  - Mostrar mensajes de error amigables usando `error` de React Query

- [ ] **Mejorar modo tiempo real**
  - Implementar actualización automática usando `refetchInterval` de React Query
  - Configurar `refetchInterval` dinámicamente según el intervalo seleccionado
  - Indicador visual de que está en modo tiempo real
  - Permitir pausar/reanudar actualizaciones

- [ ] **Mejorar ErrorBoundary**
  - ErrorBoundary más robusto con opciones de recovery
  - Integrar con React Query para mostrar errores de API
  - Mensajes de error amigables para el usuario

- [ ] **Feedback visual**
  - Implementar una versión responsive en, como mínimo, una pantalla.
  - Sistema de toasts/notificaciones para feedback al usuario (opcional pero valorado).
  - Notificar errores de API, éxito de operaciones
  - Mostrar cuando los datos están siendo actualizados en background

**Entregables**:

- UX mejorada con mejor feedback al usuario
- Documentación de estrategia de manejo de errores

---

### 4. TypeScript y Type Safety (1 hora)

#### Situación Actual

- Tipos básicos definidos
- Posibles `any` implícitos
- No hay validación de tipos en runtime

#### Tareas

- [ ] **TypeScript estricto**
  - Configurar TypeScript en modo estricto en `tsconfig.json`
  - Eliminar todos los `any` implícitos
  - Crear tipos compartidos y utility types

- [ ] **Tipos para React Query**
  - Crear tipos para query keys (usar `as const` y tipos inferidos)
  - Tipos para funciones de query y mutation
  - Tipos para parámetros de queries

- [ ] **Tipos para Twelve Data**
  - Crear tipos completos para todas las respuestas de Twelve Data
  - Tipos para diferentes endpoints (time_series, quote, symbol_search, etc.)
  - Tipos para parámetros de cada endpoint

- [ ] **Validación de datos (opcional pero valorado)**
  - Implementar validación de respuestas de API usando Zod
  - Type guards apropiados
  - Manejar casos donde la API devuelve datos inesperados

**Entregables**:

- Código con type safety completo
- Tipos bien documentados

---

### 5. Testing (Opcional pero Valorado - 2 horas)

#### Situación Actual

- No hay tests implementados

#### Tareas

- [ ] **Configurar testing**
  - Configurar Vitest (recomendado para Vite) o Jest
  - Configurar React Testing Library
  - Configurar `@tanstack/react-query` para testing

- [ ] **Tests de hooks de React Query**
  - Tests para custom hooks de queries
  - Mocking de servicios
  - Tests de estados de loading, error, success

- [ ] **Tests de componentes**
  - Tests para componentes críticos usando React Query
  - Tests de integración para flujos completos
  - Mocking apropiado de React Query

- [ ] **Cobertura**
  - Alcanzar al menos 60% de cobertura en código crítico
  - Documentar qué se testea y qué no (y por qué)

**Entregables**:

- Suite de tests funcional (si se implementa)
- Reporte de cobertura

---

### 6. Mejoras Adicionales (Opcional)

#### Developer Experience

- [ ] **ESLint/Prettier**: Configurar con reglas estrictas
- [ ] **Husky + pre-commit hooks**: Validar código antes de commit
- [ ] **CI/CD básico**: GitHub Actions o similar para tests y linting
- [ ] **Storybook**: Documentar componentes (opcional)

---

## 📦 Entregables Requeridos

1. **Código refactorizado y funcional**
   - React Query implementado en toda la aplicación
   - Optimizaciones de performance aplicadas
   - Código limpio y bien documentado
   - Commits descriptivos y bien estructurados

2. **README actualizado** con:
   - Instrucciones de setup y ejecución
   - Descripción de la nueva arquitectura con React Query
   - Estructura de carpetas explicada
   - Decisiones técnicas importantes
   - Mejoras implementadas

3. **Documento técnico** (opcional pero muy valorado) explicando:
   - **React Query**:
     - Por qué se eligió React Query
     - Estrategia de caché para cada tipo de dato
     - Configuración del QueryClient y justificación
     - Trade-offs de las decisiones tomadas
   - **Performance**:
     - Métricas antes/después (bundle size, Lighthouse scores, etc.)
     - Lista de optimizaciones implementadas
     - Justificación de cada optimización
   - **Arquitectura**:
     - Estructura de servicios y hooks
     - Decisiones de diseño
     - Próximos pasos recomendados

4. **Métricas de mejora** (obligatorio):
   - Lighthouse Performance score antes/después
   - React Profiler: tiempo de render y cantidad de re-renders
   - Screenshots o reportes de las métricas

---

## ✅ Criterios de Evaluación

### Implementación de React Query (35%) ⭐ PRIORITARIO

- ✅ React Query correctamente instalado y configurado
- ✅ QueryClient configurado con opciones apropiadas (staleTime, cacheTime, retry, etc.)
- ✅ Custom hooks creados para todas las queries principales
- ✅ Estrategia de caché bien definida según tipo de dato
- ✅ Prefetching implementado donde sea apropiado
- ✅ Invalidación de caché implementada correctamente
- ✅ Uso correcto de estados de React Query (isLoading, isError, etc.)
- ✅ Request deduplication y cancelación funcionando
- ✅ Código bien organizado (servicios, hooks, tipos)

### Optimización de Performance (30%) ⭐ PRIORITARIO

- ✅ Virtualización de tabla implementada
- ✅ Code splitting y lazy loading de rutas
- ✅ Re-renders optimizados (React.memo, useMemo, useCallback)
- ✅ Bundle size optimizado (métricas documentadas)
- ✅ Gráfico optimizado para grandes datasets
- ✅ Métricas de mejora documentadas (antes/después)
- ✅ Justificación de cada optimización

### Arquitectura y Código (20%)

- ✅ Separación clara de responsabilidades (servicios, hooks, componentes)
- ✅ Código limpio, legible y bien documentado
- ✅ TypeScript usado efectivamente (sin `any` innecesarios)
- ✅ Tipos completos para API y React Query
- ✅ Estructura de carpetas lógica y escalable

### UX y Manejo de Estados (10%)

- ✅ Estados de loading informativos usando React Query
- ✅ Manejo de errores robusto y amigable
- ✅ Modo tiempo real funcionando con refetchInterval
- ✅ Feedback visual apropiado al usuario

### Testing (5% - Opcional)

- ✅ Tests implementados (si se incluyen)
- ✅ Tests de hooks de React Query
- ✅ Cobertura apropiada

---

## 🛠️ Setup Inicial

1. **Clonar el repositorio**

   ```bash
   git clone [repo-url]
   cd metafar-challenge
   ```

2. **Instalar dependencias actuales**

   ```bash
   yarn install
   # o
   npm install
   ```

3. **Instalar React Query (TanStack Query)**

   ```bash
   yarn add @tanstack/react-query @tanstack/react-query-devtools
   # o
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```

4. **Instalar dependencias para optimizaciones (opcional pero recomendado)**

   ```bash
   # Para virtualización
   yarn add react-window
   # o
   yarn add @tanstack/react-virtual

   # Para análisis de bundle
   yarn add -D vite-bundle-visualizer
   # o
   yarn add -D rollup-plugin-visualizer
   ```

5. **Configurar API Key de Twelve Data**
   - El proyecto actualmente tiene una API key hardcodeada en `src/api/index.ts`
   - **IMPORTANTE**: Moverla a variables de entorno (`.env`)
   - Crear archivo `.env` con: `VITE_TWELVE_DATA_API_KEY=tu_api_key`
   - Puedes obtener una API key gratuita en: https://twelvedata.com/

6. **Ejecutar el proyecto**

   ```bash
   yarn dev
   # o
   npm run dev
   ```

7. **Familiarizarse con el código**
   - Revisar estructura del proyecto actual
   - Entender flujos actuales (StockTable, Detail, StockPreferenceForm)
   - Identificar áreas de mejora
   - Revisar cómo se hacen las llamadas a la API actualmente

---

## 📚 Recursos Útiles

### Documentación Twelve Data

- **API Documentation**: https://twelvedata.com/docs#overview
- **Time Series**: https://twelvedata.com/docs#time-series
- **WebSocket**: https://twelvedata.com/docs#websocket
- **Technical Indicators**: https://twelvedata.com/docs#technical-indicators
- **Symbol Search**: https://twelvedata.com/docs#symbol-search

### Herramientas Recomendadas

- **React DevTools**: Para profiling y debugging
- **Vite Bundle Analyzer**: Para analizar bundle size
- **Lighthouse**: Para métricas de performance
- **React Testing Library**: Para testing de componentes

### Librerías Requeridas y Recomendadas

- **@tanstack/react-query**: ⭐ **REQUERIDO** - Para gestión de estado del servidor y caché
- **@tanstack/react-query-devtools**: ⭐ **REQUERIDO** - DevTools para debugging de React Query
- **react-window** o **@tanstack/react-virtual**: Para virtualización de tabla
- **vite-bundle-visualizer** o **rollup-plugin-visualizer**: Para analizar bundle size
- **zod**: Opcional - Para validación de datos de API
- **react-error-boundary**: Opcional - Para mejor manejo de errores

### Documentación React Query (TanStack Query)

- **Documentación oficial**: https://tanstack.com/query/latest
- **Guía de inicio rápido**: https://tanstack.com/query/latest/docs/react/quick-start
- **Mejores prácticas**: https://tanstack.com/query/latest/docs/react/guides/important-defaults
- **Configuración de QueryClient**: https://tanstack.com/query/latest/docs/react/reference/QueryClient
- **Custom hooks**: https://tanstack.com/query/latest/docs/react/guides/custom-hooks
- **Prefetching**: https://tanstack.com/query/latest/docs/react/guides/prefetching

---

## 💡 Tips y Recomendaciones

1. **Comienza con React Query**
   - Primero instala y configura React Query
   - Crea la estructura de servicios y tipos
   - Refactoriza un componente a la vez usando React Query
   - Usa React Query DevTools para entender el comportamiento del caché

2. **Estrategia de implementación recomendada**
   - **Paso 1**: Configurar QueryClient y estructura base (1h)
   - **Paso 2**: Refactorizar servicios y crear custom hooks (2h)
   - **Paso 3**: Migrar componentes uno por uno (2h)
   - **Paso 4**: Optimizaciones de performance (3h)
   - **Paso 5**: Mejoras de UX y TypeScript (1h)

3. **React Query - Mejores prácticas**
   - Usa `queryKey` consistentes y tipados
   - Configura `staleTime` según el tipo de dato (estáticos: Infinity, tiempo real: 0)
   - Aprovecha `keepPreviousData` para transiciones suaves
   - Usa `select` para transformar datos solo cuando sea necesario
   - Implementa prefetching en interacciones del usuario (hover, etc.)

4. **Performance - Medir antes de optimizar**
   - Usa React DevTools Profiler para identificar problemas reales
   - Mide bundle size antes y después
   - No optimices prematuramente - optimiza donde hay problemas reales
   - Documenta por qué cada optimización es necesaria

5. **Trabaja incrementalmente**
   - Haz commits frecuentes y descriptivos
   - Implementa mejoras de forma incremental
   - Prueba cada cambio antes de continuar
   - Usa branches para features grandes

6. **Documenta decisiones**
   - Explica por qué elegiste React Query sobre otras soluciones
   - Documenta la estrategia de caché
   - Incluye comentarios donde el código no sea autoexplicativo
   - Justifica cada optimización de performance

7. **No busques perfección**
   - Se valora más el pensamiento estratégico que la perfección
   - Es mejor implementar bien React Query y algunas optimizaciones clave
   - Documenta qué harías con más tiempo

---

## 🎓 Nivel Esperado

Este challenge está diseñado para evaluar a un **Senior Frontend Developer** que debería:

- ✅ Tener experiencia sólida con React, TypeScript y ecosistema moderno
- ✅ **Conocer React Query (TanStack Query)** o ser capaz de aprenderlo rápidamente
- ✅ Entender arquitectura de aplicaciones frontend escalables
- ✅ Conocer técnicas de optimización de performance en React
- ✅ Ser capaz de tomar decisiones técnicas informadas
- ✅ Priorizar mantenibilidad y escalabilidad
- ✅ Escribir código limpio y bien documentado
- ✅ Entender performance y optimización (bundle size, re-renders, code splitting)
- ✅ Tener experiencia integrando APIs externas
- ✅ Ser capaz de medir y documentar mejoras de performance

**Nota**: No se espera perfección, sino demostración de:

- Capacidad de implementar React Query correctamente
- Pensamiento estratégico sobre arquitectura y performance
- Conocimiento técnico sólido
- Capacidad de tomar decisiones informadas considerando trade-offs

---

## 📝 Notas Finales

- **Tiempo**: Este challenge está diseñado para 8-12 horas, enfocado en React Query y optimizaciones de performance
- **Prioridades**:
  - ⭐ **CRÍTICO**: Implementar React Query correctamente
  - ⭐ **CRÍTICO**: Optimizaciones de performance con métricas documentadas
  - Importante: Mejoras de UX y TypeScript
  - Opcional: Testing y features adicionales
- **Preguntas**: Si tienes dudas sobre el challenge, React Query, o el proyecto, no dudes en preguntar
- **Flexibilidad**: Siéntete libre de agregar mejoras adicionales que consideres valiosas
- **Enfoque**: Se valora más la **implementación correcta de React Query** y **mejoras medibles de performance** que la cantidad de features

### Recursos de Aprendizaje Rápido de React Query

Si no tienes experiencia previa con React Query, estos recursos te ayudarán:

- **Quick Start**: https://tanstack.com/query/latest/docs/react/quick-start (15 min)
- **Tutorial interactivo**: https://tanstack.com/query/latest/docs/react/overview
- **Ejemplos comunes**: https://tanstack.com/query/latest/docs/react/examples/react/basic

### Entrega del Challenge: Clonado, Repositorio Público y Envío del Link

- Antes de empezar con el challenge, por favor cloná el proyecto, trabajá sobre una copia en tu entorno local y luego subilo a un repositorio personal (GitHub o GitLab).
- Dejalo configurado como público para que podamos revisarlo sin problemas.
- Una vez que lo tengas terminado, envianos el link del repositorio por mail.

¡Buena suerte! 🚀
