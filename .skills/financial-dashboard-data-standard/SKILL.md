---
name: financial-dashboard-data-standard
description: Regla basica para mantener formato de moneda y porcentaje consistente en el dashboard financiero.
---

# Financial Dashboard Data Standard

## Objetivo
Asegurar que todos los valores financieros del dashboard usen el mismo formato de moneda, porcentaje y fecha.

## Inputs
- Archivo o componente a revisar.
- Locale objetivo (ej: es-ES o en-US).
- Moneda objetivo (ej: EUR o USD).

## Output Esperado
- Lista corta de cambios recomendados.
- Ejemplos de formato correcto para moneda, porcentaje y fecha.
- Confirmacion de funciones reutilizables para evitar hardcode.

## Criterios de Aceptacion
- No hay formatos hardcodeados en componentes visuales.
- Se usa una utilidad central para moneda y porcentaje.
- El locale y la moneda vienen de configuracion o variables de entorno.
- Los datos en tablas, KPI y graficas muestran formato consistente.
