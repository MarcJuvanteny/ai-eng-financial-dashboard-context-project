import { type KeyboardEvent, useId, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import { formatCurrency } from '@/lib/financial-utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface IncomeOutcomeChartProps {
  data: MonthlyDataPoint[]
  loading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function IncomeOutcomeChart({ data, loading }: IncomeOutcomeChartProps) {
  const chartDescriptionId = useId()
  const keyboardHelpId = useId()
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null)

  if (loading) {
    return (
      <Card
        className="border-border/60"
        role="status"
        aria-live="polite"
        aria-label="Loading income and outcome chart"
      >
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const hasData = data.some((d) => d.income > 0 || d.outcome > 0)
  const activePoint = activePointIndex === null ? null : (data[activePointIndex] ?? null)

  const activePointAnnouncement =
    activePoint === null
      ? 'Chart focused. Press Enter or Space to select the first month.'
      : `${activePoint.month}. Income ${formatCurrency(activePoint.income)}. Outcome ${formatCurrency(activePoint.outcome)}.`

  const handleKeyboardNavigation = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasData || data.length === 0) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActivePointIndex((prev) => (prev === null ? 0 : prev))
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActivePointIndex((prev) => {
        if (prev === null) return 0
        return prev === data.length - 1 ? 0 : prev + 1
      })
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActivePointIndex((prev) => {
        if (prev === null) return data.length - 1
        return prev === 0 ? data.length - 1 : prev - 1
      })
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      setActivePointIndex(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      setActivePointIndex(data.length - 1)
    }
  }

  return (
    <Card className="border-border/60" role="region" aria-label="Income versus outcome chart">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Income vs. Outcome</CardTitle>
        <CardDescription id={chartDescriptionId}>Monthly revenue and expenditure evolution</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div
            className="flex h-[280px] items-center justify-center text-muted-foreground text-sm"
            role="status"
            aria-live="polite"
          >
            No data available to display
          </div>
        ) : (
          <div
            role="group"
            tabIndex={0}
            aria-label="Line chart with monthly income and outcome values"
            aria-describedby={`${chartDescriptionId} ${keyboardHelpId}`}
            onKeyDown={handleKeyboardNavigation}
          >
            <p id={keyboardHelpId} className="sr-only">
              Keyboard navigation enabled. Press Enter or Space to start, then use left and right arrow keys
              to move across months.
            </p>
            <p className="sr-only" aria-live="polite">
              {activePointAnnouncement}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground capitalize">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="income"
                  stroke="var(--chart-income)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-income)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="outcome"
                  name="outcome"
                  stroke="var(--chart-outcome)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-outcome)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
