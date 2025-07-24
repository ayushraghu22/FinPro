import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/contexts/transactions-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
  Cell,
  ReferenceLine,
} from "recharts";

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Helper to get all months between two dates (inclusive)
function getAllMonthsBetween(start: string, end: string) {
  const result: string[] = [];
  let current = new Date(start);
  const endDate = new Date(end);
  current.setDate(1); // always first of month
  endDate.setDate(1);
  while (current <= endDate) {
    result.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`);
    current.setMonth(current.getMonth() + 1);
  }
  return result;
}

// Custom tooltip for more info
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white p-3 rounded shadow text-sm border">
        <div className="font-semibold">{label}</div>
        <div>
          Profit/Loss: <span className={value >= 0 ? "text-green-600" : "text-red-600"}>₹{value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
}

// Custom label for bar values that handles positive/negative positioning
function BarValueLabel(props: any) {
  const { x, y, width, value, height, yAxis } = props;
  const isPositive = value >= 0;
  const offset = 8;
  let labelY = y - offset; // default for positive
  if (!isPositive) {
    // Place at y=0 (x-axis), just above the axis
    if (props.yAxis && typeof props.yAxis.scale === 'function') {
      labelY = props.yAxis.scale(0) - 4; // 4px above axis
    } else {
      labelY = y + Math.abs(height) + offset; // fallback
    }
  }
  return (
    <text
      x={x + width / 2}
      y={labelY}
      textAnchor="middle"
      fontSize={13}
      fontWeight={600}
      fill="#334155"
    >
      ₹{value.toLocaleString()}
    </text>
  );
}

export default function ProfitLoss() {
  const { transactions } = useTransactions();
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const defaultEnd = formatDate(today);
  const prevMonth = new Date(today);
  prevMonth.setMonth(prevMonth.getMonth() - 6);
  const defaultStart = formatDate(prevMonth);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Filter transactions by date range
  const filtered = transactions.filter(t => {
    if (!t.sellingDate) return false;
    const d = new Date(t.sellingDate);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate)) return false;
    return true;
  });

  // Aggregate profit/loss by month
  const monthly: Record<string, { profit: number }> = {};
  filtered.forEach(t => {
    const month = getMonthYear(t.sellingDate);
    const profit = (t.expectedSellingPrice - t.purchasingPrice) * t.units;
    if (!monthly[month]) monthly[month] = { profit: 0 };
    monthly[month].profit += profit;
  });
  // Always show all months in the interval
  const allMonths = startDate && endDate ? getAllMonthsBetween(startDate, endDate) : [];
  const chartData = allMonths.map(month => ({
    month,
    profit: monthly[month]?.profit || 0,
  }));

  const totalProfit = chartData.reduce((sum, d) => sum + d.profit, 0);

  // Custom bar color: green for profit, red for loss
  const getBarColor = (profit: number) => (profit >= 0 ? "#22c55e" : "#ef4444");

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Date Range Picker */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
              <label className="flex flex-col text-sm font-medium">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-sm font-medium">
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
            </div>
            {/* Chart */}
            <div className="h-96 bg-muted/50 rounded-md p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 30, right: 40, left: 10, bottom: 30 }}
                  barSize={48}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 14, fontWeight: 500, fill: "#334155" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin', 'dataMax']}
                    tick={{ fontSize: 14, fontWeight: 500, fill: "#334155" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9", opacity: 0.5 }} />
                  <Legend wrapperStyle={{ fontSize: 14 }} />
                  <Bar
                    dataKey="profit"
                    name="Profit/Loss"
                    isAnimationActive={true}
                    radius={[8, 8, 0, 0]}
                    label={<BarValueLabel />}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={getBarColor(entry.profit)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Summary */}
            <div className="mt-4 text-lg font-semibold">
              Total Profit/Loss: <span className={totalProfit >= 0 ? "text-green-600" : "text-red-600"}>₹{totalProfit.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 