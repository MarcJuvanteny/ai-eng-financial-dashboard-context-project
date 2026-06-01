# Desglose de Componentes por Funcionalidad

## Objetivo
Este documento describe los componentes del frontend organizados por funcionalidad, indicando:
- componentes actualmente implementados
- componentes reutilizables de soporte
- componentes faltantes para nuevas funcionalidades de API (Facets, Alerts y Top Categories)

## Mapa General de Pantalla
- App shell: `src/App.tsx`
- Header: `src/components/dashboard/dashboard-header.tsx`
- KPIs: `src/components/dashboard/kpi-row.tsx` + `src/components/dashboard/kpi-card.tsx`
- Chart 1: `src/components/dashboard/income-outcome-chart.tsx`
- Chart 2: `src/components/dashboard/profit-percent-chart.tsx`
- UI base: `src/components/ui/card.tsx`, `src/components/ui/skeleton.tsx`

## Funcionalidad: Carga y Composicion del Dashboard
### Responsable
- `App`

### Componentes
- `App` (`src/App.tsx`)

### Responsabilidades
- Hace fetch de datos financieros (`/api/metrics`)
- Gestiona estado global de la vista:
  - `loading`
  - `error`
  - `metrics`
  - `monthlyData`
- Compone el layout principal y renderiza el resto de secciones

## Funcionalidad: Encabezado de Dashboard
### Responsable
- `DashboardHeader`

### Componentes
- `DashboardHeader` (`src/components/dashboard/dashboard-header.tsx`)

### Responsabilidades
- Muestra titulo principal del dashboard
- Muestra descripcion corta
- Muestra periodo activo

## Funcionalidad: KPIs Principales
### Responsables
- `KPIRow`
- `KPICard`

### Componentes
- `KPIRow` (`src/components/dashboard/kpi-row.tsx`)
- `KPICard` (`src/components/dashboard/kpi-card.tsx`)

### Responsabilidades
- `KPIRow`:
  - Define los 4 KPIs mostrados
  - Enlaza valores calculados con presentacion
  - Pasa estado de carga a cada tarjeta
- `KPICard`:
  - Renderiza etiqueta, valor, helper text e icono
  - Gestiona variantes visuales (`income`, `outcome`, `profit`, `profitPercent`)
  - Renderiza skeleton en estado `loading`

## Funcionalidad: Evolucion Ingresos vs Egresos
### Responsable
- `IncomeOutcomeChart`

### Componentes
- `IncomeOutcomeChart` (`src/components/dashboard/income-outcome-chart.tsx`)

### Responsabilidades
- Renderiza serie temporal de ingresos y egresos
- Muestra tooltip custom con formato monetario
- Muestra estado vacio si no hay datos
- Muestra skeleton durante carga

## Funcionalidad: Evolucion de Margen de Beneficio
### Responsable
- `ProfitPercentChart`

### Componentes
- `ProfitPercentChart` (`src/components/dashboard/profit-percent-chart.tsx`)

### Responsabilidades
- Renderiza serie temporal de `profitPercent`
- Incluye linea de referencia en 0%
- Muestra tooltip custom en porcentaje
- Muestra estado vacio y skeleton

## Funcionalidad: Manejo de Error de Datos
### Responsable
- `App`

### Componentes
- Bloque inline de error en `App` (`src/App.tsx`)

### Responsabilidades
- Captura error en fetch inicial
- Muestra mensaje al usuario si falla la API

## Funcionalidad: Facets (API `/api/metrics/facets`)
### Estado actual
- No hay componente dedicado implementado

### Componentes sugeridos
- `MetricsFiltersBar`
- `DateRangePicker`
- `CategorySelect`
- `OperationTypeSelect`
- `BusinessTypeSelect`

### Objetivo funcional
- Cargar y exponer opciones de filtrado basadas en `FacetsResponse`
- Limitar filtros a valores realmente disponibles

## Funcionalidad: Alerts (API `/api/metrics/alerts`)
### Estado actual
- No hay componente dedicado implementado

### Componentes sugeridos
- `AlertsPanel`
- `AlertsList`
- `AlertCard`
- `AlertsThresholdControl`

### Objetivo funcional
- Mostrar alertas de incremento de egresos usando `AlertsResponse`
- Permitir ajustar `threshold`, `group_by` y rango de fechas

## Funcionalidad: Top Categories (API `/api/metrics/categories/top`)
### Estado actual
- No hay componente dedicado implementado

### Componentes sugeridos
- `TopCategoriesPanel`
- `TopCategoriesList`
- `TopCategoryRow`
- `TopCategoriesFilters`

### Objetivo funcional
- Mostrar ranking por categoria usando `TopCategroiesResponse`
- Permitir filtros por `operation_type`, `limit`, `business_type` y rango de fechas

## Componentes UI Reutilizables
### Base actual
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription` (`src/components/ui/card.tsx`)
- `Skeleton` (`src/components/ui/skeleton.tsx`)

### Uso transversal
- Contenedores de seccion
- Estados de carga
- Consistencia visual de tarjetas

## Dependencias de Tipado y Transformacion
- Tipos de dominio actuales: `src/lib/financial-types.ts`
- Tipos de API y params: `specs/api-types.ts`, `specs/param-types.ts`
- Utilidades de calculo/formato: `src/lib/financial-utils.ts`

## Notas de Implementacion
- Los componentes sugeridos para Facets, Alerts y Top Categories estan pendientes de implementacion.
- Conviene separar por feature en carpetas dedicadas para mantener escalabilidad, por ejemplo:
  - `src/components/filters/*`
  - `src/components/alerts/*`
  - `src/components/top-categories/*`
