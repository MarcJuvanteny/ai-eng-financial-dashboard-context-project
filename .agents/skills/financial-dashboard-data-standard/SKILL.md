---
name: financial-dashboard-data-standard
description: Regla basica para mantener formato de moneda y porcentaje consistente en el dashboard financiero.
license: MIT
metadata:
	author: ai-eng-financial-dashboard-context-project
	version: "1.0"
---

# Financial Dashboard Data Standard

Standardize financial formatting across dashboard UI components so currency, percentage, and date values are always represented with the same locale-aware rules.

## How it works

1. Detect where formatting is currently happening (utilities, components, charts, table renderers).
2. Consolidate all currency and percentage rendering into shared helpers.
3. Verify locale and currency are sourced from configuration, not hardcoded values.
4. Validate consistency in KPI cards, charts, tables, and summaries.

## When to use this skill

Use this skill when:
- The user asks to normalize number formats in the dashboard.
- Currency or percent values appear inconsistent across views.
- A PR introduces new KPI, chart, or table components with financial values.
- You are preparing data formatting rules before integrating real backend data.

Avoid using this skill when:
- The task is unrelated to financial display formatting.
- The issue is data correctness (business logic) rather than presentation format.

## Inputs
- File or component to review.
- Target locale (for example, `es-ES` or `en-US`).
- Target currency (for example, `EUR` or `USD`).
- Existing formatter utilities (if any).

## Formatting contract

### Currency
- Always format via `Intl.NumberFormat` with `style: "currency"`.
- Use centralized helper (for example `formatCurrency(value, locale, currency)`).
- Keep fixed decimal behavior aligned with product rules (commonly 2 decimals).

Example:
```ts
export function formatCurrency(
	value: number,
	locale: string,
	currency: string,
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}
```

### Percentage
- Treat percentages consistently as either ratio input (`0.12 -> 12%`) or full input (`12 -> 12%`).
- Use one helper and document expected input semantics.
- Keep precision consistent by context (for example, 1 decimal in KPIs, 2 in detail tables).

Example (ratio input):
```ts
export function formatPercent(value: number, locale: string): string {
	return new Intl.NumberFormat(locale, {
		style: "percent",
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	}).format(value);
}
```

### Date
- Use locale-aware date formatting helpers.
- Do not hardcode month/day order in components.

Example:
```ts
export function formatDate(value: Date | string, locale: string): string {
	const date = value instanceof Date ? value : new Date(value);
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
}
```

## Component coverage checklist

- KPI cards use shared formatters.
- Bar/line/pie chart labels and tooltips use shared formatters.
- Summary table cells use shared formatters.
- Export/download views (if present) follow the same formatting rules.
- Loading/skeleton fallback does not leak unformatted raw values.

## Output expected

- Short, actionable list of required changes.
- Code references where formatting should be centralized.
- Concrete examples for currency, percentage, and date rendering.
- Final consistency checklist result (pass/fail per area).

## Acceptance criteria

- No hardcoded formatting logic remains inside visual components.
- Currency and percent formatting goes through shared helpers.
- Locale and currency come from config/environment or app settings.
- KPI cards, charts, and tables display values consistently.
- Unit tests cover formatting helpers for at least two locales and two currencies.

## Suggested validation

Run targeted checks after changes:

```bash
npm run test -- financial-utils
npm run lint
```

If tests are unavailable, document the manual validation performed across representative UI sections.
