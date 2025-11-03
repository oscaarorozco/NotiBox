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
import { useContentStore } from "@/hooks/use-content-store";
import { useMemo } from "react";
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ChartConfig } from "@/components/ui/chart";
import { RecentItems } from "./recent-items";
import { Folder, File, Tag } from "lucide-react";

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

const tagsUsageChartConfig = {
  count: {
    label: "Usos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export function StatsView() {
  const { appData } = useContentStore();

  const summaryData = useMemo(() => {
    const totalTags = new Set(appData.items.flatMap(item => item.tags));
    return {
        groups: appData.groups.length,
        items: appData.items.length,
        tags: totalTags.size,
    }
  }, [appData]);

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
    return Object.entries(counts).map(([name, value]) => ({ name: typeTranslations[name] || name, value, fill: `var(--color-${name})` }));
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

  const tagsUsageData = useMemo(() => {
    const tagCounts: { [tag: string]: number } = {};
    appData.items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags
  }, [appData.items]);

  return (
    <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
                    <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryData.groups}</div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Elementos</CardTitle>
                    <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryData.items}</div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Etiquetas Únicas</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summaryData.tags}</div>
                </CardContent>
             </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
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
                                    <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                                    <Line type="monotone" dataKey="count" name="Interacciones" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8, fill: 'hsl(var(--primary))' }} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <RecentItems />
            </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <CardTitle>Tipos de Contenido</CardTitle>
                    <CardDescription>Distribución de tu contenido guardado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ChartContainer config={contentTypeChartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
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
                                        {contentTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={contentTypeChartConfig[entry.name as keyof typeof contentTypeChartConfig]?.color} stroke="hsl(var(--background))" />
                                        ))}
                                    </Pie>
                                    <ChartLegend content={<ChartLegendContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Uso de Etiquetas</CardTitle>
                    <CardDescription>Las 10 etiquetas más utilizadas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ChartContainer config={tagsUsageChartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tagsUsageData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis type="number" dataKey="count" tickLine={false} axisLine={false} allowDecimals={false}/>
                                <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent />} />
                                <Bar dataKey="count" name="Usos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}