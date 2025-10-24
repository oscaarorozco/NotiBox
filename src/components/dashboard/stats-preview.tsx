"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, YAxis, Tooltip as RechartsTooltip, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { useMemo } from "react";
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ChartConfig } from "@/components/ui/chart"

const weeklyActivityChartConfig = {
  count: {
    label: "Interacciones",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const contentTypeChartConfig = {
    'Notas': { label: 'Notas', color: 'hsl(var(--chart-1))' },
    'Enlaces': { label: 'Enlaces', color: 'hsl(var(--chart-2))' },
    'Imágenes': { label: 'Imágenes', color: 'hsl(var(--chart-3))' },
    'Tareas': { label: 'Tareas', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig

export function StatsPreview() {
  const { appData } = useContentStore();

  const contentTypeData = useMemo(() => {
    const counts = appData.items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const typeTranslations: {[key: string]: string} = {
        'note': 'Notas',
        'link': 'Enlaces',
        'image': 'Imágenes',
        'todo': 'Tareas'
    }
    return Object.entries(counts).map(([name, value]) => ({ name: typeTranslations[name] || name, value, fill: `var(--color-${typeTranslations[name] || name})` }));
  }, [appData.items]);

  const weeklyActivityData = useMemo(() => {
    const today = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const activityMap = last7Days.reduce((acc, day) => {
        acc[format(day, 'yyyy-MM-dd')] = 0;
        return acc;
    }, {} as Record<string, number>);

    appData.stats.forEach(log => {
        const logDate = format(new Date(log.timestamp), 'yyyy-MM-dd');
        if (logDate in activityMap) {
            activityMap[logDate]++;
        }
    });

    return Object.entries(activityMap).map(([date, count]) => ({
        date: format(new Date(date), 'eee', { locale: es }),
        count,
    }));
  }, [appData.stats]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Actividad Semanal</h4>
        <div className="h-[120px] w-full">
            <ChartContainer config={weeklyActivityChartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<ChartTooltipContent />} cursor={false}/>
                        <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Tipos de Contenido</h4>
        <div className="h-[120px] w-full">
            <ChartContainer config={contentTypeChartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2}>
                            {contentTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="hsl(var(--card))" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
      </div>
    </div>
  );
}
