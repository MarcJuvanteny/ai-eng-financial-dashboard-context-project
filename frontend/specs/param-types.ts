import type { BusinessType, GroupBy, OperationType } from './api-types'

/**
 * Shared date filter shape used by multiple metrics endpoints.
 */
export interface DateRangeFIlter {
  /**
   * Inclusive start date.
   * Format: YYYY-MM-DD (ISO 8601 date).
   */
  start_date?: string

  /**
   * Inclusive end date.
   * Format: YYYY-MM-DD (ISO 8601 date).
   */
  end_date?: string
}

/**
 * Query params for alerts endpoint.
 */
export interface AlertsParams extends DateRangeFIlter {
  /**
   * Alert trigger threshold as a ratio over baseline.
   * Example: 0.3 means +30%.
   */
  threshold?: number

  /** Period grouping used to evaluate anomalies. */
  group_by?: GroupBy

  /** Optional business segment filter. */
  business_type?: BusinessType
}

/**
 * Query params for top categories endpoint.
 */
export interface TopCategoriesParams extends DateRangeFIlter {
  /** Operation type used to build ranking. */
  operation_type?: OperationType

  /** Max number of rows to return. Backend range: 1..20. */
  limit?: number

  /** Optional business segment filter. */
  business_type?: BusinessType
}
