"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportEmptyState } from "@/components/reports/report-empty-state";

type ReportChartProps = {
  data: Array<{
    name: string;
    total: number;
  }>;
  title: string;
};

export function ReportChart({ data, title }: ReportChartProps) {
  const hasData = data.some((item) => item.total > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-navy-950">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#071f3d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ReportEmptyState message="Sem dados para este grafico." />
        )}
      </CardContent>
    </Card>
  );
}
