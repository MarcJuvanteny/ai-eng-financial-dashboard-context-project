/**
 * Financial operation direction.
 * Valid values:
 * - income: money entering the business
 * - outcome: money leaving the business
 */
export type OperationType = 'income' | 'outcome'

/**
 * Supported movement category.
 * Valid values are aligned with backend enums.
 */
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'

/**
 * Business segment type.
 * Valid values:
 * - B2B: business to business
 * - B2C: business to consumer
 */
export type BusinessType = 'B2B' | 'B2C'

/**
 * Time aggregation unit used by summary and alerts endpoints.
 * Valid values:
 * - day
 * - week
 * - month
 */
export type GroupBy = 'day' | 'week' | 'month'

/**
 * One financial movement record.
 */
export interface FinancialMovement {
  /**
   * Movement creation date.
   * Format: YYYY-MM-DD (ISO 8601 date).
   */
  create_date: string

  /**
   * Absolute amount of the movement.
   * Unit: monetary amount in the default currency.
   */
  amount: number

  /** Operation direction. */
  operation_type: OperationType

  /** Category assigned to this movement. */
  category: Category

  /** Business segment where this movement belongs. */
  business_type: BusinessType
}

/**
 * Available filter values and date coverage for metrics.
 */
export interface MetricsFacets {
  /** Distinct operation types available in dataset. */
  operation_types: OperationType[]

  /** Distinct business types available in dataset. */
  business_types: BusinessType[]

  /** Distinct categories available in dataset. */
  categories: Category[]

  /**
   * Earliest movement date in the dataset.
   * Format: YYYY-MM-DD (ISO 8601 date).
   */
  min_date: string

  /**
   * Latest movement date in the dataset.
   * Format: YYYY-MM-DD (ISO 8601 date).
   */
  max_date: string
}

/**
 * Facets endpoint response payload.
 * Equivalent structure to MetricsFacets.
 */
export interface FacetsResponse {
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: Category[]
  min_date: string
  max_date: string
}

/**
 * Aggregated totals for one period in summary endpoints.
 */
export interface MetricsSummaryItem {
  /**
   * Group period key.
   * Expected format by group_by:
   * - day: YYYY-MM-DD
   * - week: YYYY-Www (ISO week)
   * - month: YYYY-MM
   */
  period: string

  /** Total income for the period. */
  income: number

  /** Total outcome for the period. */
  outcome: number

  /** Net value for the period (income - outcome). */
  net: number
}

/**
 * Ranked category total entry.
 */
export interface TopCategoryItem {
  /** Category label. */
  category: Category

  /** Operation direction used to compute ranking. */
  operation_type: OperationType

  /** Total accumulated amount for the category. */
  total_amount: number
}

/**
 * Alias model for top categories entries.
 */
export interface CategorEntry {
  category: Category
  operation_type: OperationType
  total_amount: number
}

/**
 * Comparison between current period and previous period net values.
 */
export interface MetricsComparison {
  /** Net value for current selected range. */
  current_period: number

  /** Net value for equivalent previous range. */
  previous_period: number

  /** Absolute delta between current and previous. */
  delta_abs: number

  /**
   * Relative delta in percentage.
   * Null when previous_period is 0.
   */
  delta_pct: number | null
}

/**
 * Outcome anomaly alert for a given period.
 */
export interface MetricsAlert {
  /**
   * Period where anomaly was detected.
   * Format follows group_by:
   * - day: YYYY-MM-DD
   * - week: YYYY-Www
   * - month: YYYY-MM
   */
  period: string

  /** Outcome total for the flagged period. */
  outcome_total: number

  /** Historical baseline average used for comparison. */
  baseline_average: number

  /**
   * Increase ratio over baseline.
   * Example: 0.3 means +30%.
   */
  increase_ratio: number
}

/**
 * Alias model for alerts entries.
 */
export interface AlertEntry {
  period: string
  outcome_total: number
  baseline_average: number
  increase_ratio: number
}

/**
 * Query params for /api/metrics.
 */
export interface GetMetricsParams {
  /**
   * Inclusive start date.
   * Format: YYYY-MM-DD.
   */
  start_date?: string

  /**
   * Inclusive end date.
   * Format: YYYY-MM-DD.
   */
  end_date?: string

  /** Optional category filter. */
  category?: Category

  /** Optional operation type filter. */
  operation_type?: OperationType
}

/**
 * Query params for /api/metrics/summary.
 */
export interface GetMetricsSummaryParams extends GetMetricsParams {
  /** Aggregation unit. */
  group_by?: GroupBy

  /** Optional business segment filter. */
  business_type?: BusinessType
}

/**
 * Query params for /api/metrics/categories/top.
 */
export interface GetTopCategoriesParams {
  /** Operation type to rank categories by. */
  operation_type?: OperationType

  /** Max number of rows returned. Backend range: 1..20. */
  limit?: number

  /** Inclusive start date. Format: YYYY-MM-DD. */
  start_date?: string

  /** Inclusive end date. Format: YYYY-MM-DD. */
  end_date?: string

  /** Optional business segment filter. */
  business_type?: BusinessType
}

/**
 * Query params for /api/metrics/comparison.
 */
export interface GetMetricsComparisonParams {
  /** Inclusive start date. Required. Format: YYYY-MM-DD. */
  start_date: string

  /** Inclusive end date. Required. Format: YYYY-MM-DD. */
  end_date: string

  /** Optional business segment filter. */
  business_type?: BusinessType
}

/**
 * Health endpoint payload.
 */
export type HealthResponse = {
  /** Service status string (for example: ok). */
  status: string
}

/**
 * Alerts endpoint response list.
 */
export interface AlertsResponse extends Array<AlertEntry> {}

/**
 * Top categories endpoint response list.
 */
export interface TopCategroiesResponse extends Array<CategorEntry> {}

/** Response payload for /api/metrics. */
export type GetMetricsResponse = FinancialMovement[]

/** Response payload for /api/metrics/facets. */
export type GetMetricsFacetsResponse = MetricsFacets

/** Response payload for /api/metrics/summary. */
export type GetMetricsSummaryResponse = MetricsSummaryItem[]

/** Response payload for /api/metrics/categories/top. */
export type GetTopCategoriesResponse = TopCategoryItem[]

/** Response payload for /api/metrics/comparison. */
export type GetMetricsComparisonResponse = MetricsComparison
