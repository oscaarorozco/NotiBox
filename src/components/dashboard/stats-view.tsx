"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer, LineChart, Line, YAxis, Tooltip as RechartsTooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import { useMemo } from "react";
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ChartConfig } from "@/components/ui/chart";
import { RecentItems } from "./recent-items";

const monthlyActivityChartConfig = {
  count: {
    label: "Interacciones",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const contentTypeChartConfig = {
    'Notas': { label: 'Notas', color: 'hsl(var(--chart-1))' },
    'Enlaces': { label: 'Enlaces', color: 'hsl(var(--chart-2))' },
    'Imágenes': { label: 'Imágenes', color: 'hsl(var(--chart-3))' },
    'Tareas': { label: 'Tareas', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig

const groupUsageChartConfig = {
  total: {
    label: "Accesos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


export function StatsView() {
  const { appData } = useContentStore();

  const groupUsageData = useMemo(() => {
    return appData.groups.map(group => ({
      name: group.name,
      total: group.accessCount,
    })).sort((a,b) => b.total - a.total);
  }, [appData.groups]);

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
    const last30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });
    const activityMap = last30Days.reduce((acc, day) => {
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
        date: format(new Date(date), 'MMM d', { locale: es }),
        count,
    }));
  }, [appData.stats]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-8 xl:col-span-9">
            <CardHeader>
                <CardTitle>Actividad Mensual</CardTitle>
                <CardDescription>Tu interacción con la app en los últimos 30 días.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[300px] w-full">
                    <ChartContainer config={monthlyActivityChartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                                <RechartsTooltip content={<ChartTooltipContent />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8, fill: 'hsl(var(--primary))' }} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-4 xl:col-span-3">
             <RecentItems />
        </Card>
        <Card className="lg:col-span-5">
            <CardHeader>
                <CardTitle>Tipos de Contenido</CardTitle>
                <CardDescription>Distribución de tu contenido guardado.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[300px] w-full">
                    <ChartContainer config={contentTypeChartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                  return (
                                    <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                      {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                  );
                                }}>
                                    {contentTypeData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={entry.fill} stroke="hsl(var(--background))" />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-7">
            <CardHeader>
                <CardTitle>Uso de Grupos</CardTitle>
                <CardDescription>Número de veces que se ha accedido a cada grupo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ChartContainer config={groupUsageChartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={groupUsageData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
                            <XAxis type="number" dataKey="total" tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
                        </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
