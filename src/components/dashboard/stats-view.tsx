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

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

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
        'image': 'Imágenes'
    }
    return Object.entries(counts).map(([name, value]) => ({ name: typeTranslations[name] || name, value }));
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
        date: format(new Date(date), 'MMM d', { locale: es }),
        count,
    }));
  }, [appData.stats]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Uso de Grupos</CardTitle>
                <CardDescription>Número de veces que se ha accedido a cada grupo.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={groupUsageData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Tipos de Contenido</CardTitle>
                <CardDescription>Distribución de tu contenido guardado.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={contentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {contentTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Actividad Semanal</CardTitle>
                <CardDescription>Tu interacción con la app en los últimos 7 días.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="count" name="Interacciones" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
