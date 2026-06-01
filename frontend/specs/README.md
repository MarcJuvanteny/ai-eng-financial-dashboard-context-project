# Specs de Funcionalidades API (Frontend)

Este documento cubre 3 funcionalidades del dashboard:
- Facets
- Alerts
- Top Categories

La verificacion de rutas se hizo contra los endpoints definidos en FastAPI (los mismos que expone `/docs`).

## 1) Facets

### Endpoint consumido
- `GET /api/metrics/facets`

### Verificacion de ruta contra /docs
- Declarado en backend como `@router.get("/api/metrics/facets", response_model=MetricsFacets)`.
- Coincide con lo esperado para documentacion OpenAPI en `/docs`.

### Tipos TypeScript usados
- Request params: no requiere parametros.
- Response:
  - `FacetsResponse`
  - (equivalente tambien disponible: `MetricsFacets`)
- Tipos internos relacionados:
  - `OperationType`
  - `BusinessType`
  - `Category`

### Valores validos y restricciones
- No hay query params para este endpoint.
- Campos de respuesta:
  - `operation_types`: lista de valores validos de `OperationType` (`income`, `outcome`)
  - `business_types`: lista de valores validos de `BusinessType` (`B2B`, `B2C`)
  - `categories`: lista de valores validos de `Category` (`suppliers`, `sales`, `operational`, `administrative`, `others`)
  - `min_date` y `max_date`: formato `YYYY-MM-DD`

### Casos edge y comportamiento esperado de UI
- Edge 1: respuesta vacia parcial (por ejemplo `categories: []`).
  - UI debe deshabilitar ese filtro y mostrar estado sin opciones (sin romper layout).
- Edge 2: fechas invalidas o invertidas en respuesta (`min_date > max_date`).
  - UI debe ignorar rango recibido, mostrar aviso no bloqueante y usar un estado de filtro seguro por defecto.

## 2) Alerts

### Endpoint consumido
- `GET /api/metrics/alerts`

### Verificacion de ruta contra /docs
- Declarado en backend como `@router.get("/api/metrics/alerts", response_model=list[MetricsAlert])`.
- Coincide con documentacion OpenAPI para `/docs`.

### Tipos TypeScript usados
- Request params:
  - `AlertsParams`
  - `DateRangeFIlter` (base)
- Response:
  - `AlertsResponse`
  - `AlertEntry`
  - (equivalente tambien disponible: `MetricsAlert`)
- Tipos internos relacionados:
  - `GroupBy`
  - `BusinessType`

### Valores validos y restricciones
- `threshold`:
  - tipo: `number`
  - restriccion backend: `>= 0`
  - default backend: `0.3`
- `group_by`:
  - valores validos: `day`, `week`, `month`
  - default backend: `month`
- `start_date`:
  - opcional
  - formato: `YYYY-MM-DD`
- `end_date`:
  - opcional
  - formato: `YYYY-MM-DD`
- `business_type`:
  - opcional
  - valores validos: `B2B`, `B2C`

### Casos edge y comportamiento esperado de UI
- Edge 1: no hay alertas (array vacio).
  - UI debe mostrar estado vacio explicativo (ejemplo: "No se detectaron alertas para los filtros actuales").
- Edge 2: `threshold` invalido (negativo) devuelve error de validacion 422.
  - UI debe mostrar mensaje de error de validacion y mantener filtros editables para corregir.

## 3) Top Categories

### Endpoint consumido
- `GET /api/metrics/categories/top`

### Verificacion de ruta contra /docs
- Declarado en backend como `@router.get("/api/metrics/categories/top", response_model=list[TopCategoryItem])`.
- Coincide con documentacion OpenAPI para `/docs`.

### Tipos TypeScript usados
- Request params:
  - `TopCategoriesParams`
  - `DateRangeFIlter` (base)
- Response:
  - `TopCategroiesResponse`
  - `CategorEntry`
  - (equivalentes tambien disponibles: `TopCategoryItem`, `GetTopCategoriesResponse`)
- Tipos internos relacionados:
  - `OperationType`
  - `BusinessType`
  - `Category`

### Valores validos y restricciones
- `operation_type`:
  - opcional
  - valores validos: `income`, `outcome`
  - default backend: `outcome`
- `limit`:
  - tipo: `number`
  - restriccion backend: `1..20`
  - default backend: `5`
- `start_date`:
  - opcional
  - formato: `YYYY-MM-DD`
- `end_date`:
  - opcional
  - formato: `YYYY-MM-DD`
- `business_type`:
  - opcional
  - valores validos: `B2B`, `B2C`

### Casos edge y comportamiento esperado de UI
- Edge 1: `limit` fuera de rango (0 o >20) devuelve 422.
  - UI debe mostrar error de validacion y ajustar automaticamente al rango permitido (por ejemplo 1 o 20) antes de reintentar.
- Edge 2: respuesta vacia para filtros muy restrictivos.
  - UI debe mostrar estado vacio en lista/ranking (sin grafico roto), con llamada a accion para limpiar filtros.

## Referencia de Archivos de Tipos
- `frontend/specs/api-types.ts`
- `frontend/specs/param-types.ts`
