'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import HeaderBar from "@/components/HeaderBar";
import { GlobalModal } from "@/components/ui/GlobalModal";

type TimeRange = 'week' | 'month' | 'year';
type ChartType = 'bar' | 'pie';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

// Mock data - replace with real data from your API
function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6 p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Demonstração do Modal</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Clique no botão abaixo para abrir um modal de exemplo.
      </p>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal de Exemplo</Button>
      
      <GlobalModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Título do Modal"
        primaryAction={{
          label: 'Confirmar',
          onClick: () => {
            alert('Ação confirmada!');
            setIsOpen(false);
          },
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsOpen(false),
          variant: 'outline',
        }}
      >
        <div className="py-4">
          <p>Este é um exemplo de conteúdo dentro do modal.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Você pode colocar qualquer conteúdo aqui, como formulários, mensagens, etc.
          </p>
        </div>
      </GlobalModal>
    </div>
  );
}

export default function ReportsPage() {
    const [timeRange, setTimeRange] = useState<TimeRange>('month');
    const [chartType, setChartType] = useState<ChartType>('bar');

    // Mock data - replace with real data from your API
    const categoryData = [
        { name: 'Alimentação', value: 1200 },
        { name: 'Moradia', value: 2500 },
        { name: 'Transporte', value: 800 },
        { name: 'Lazer', value: 600 },
        { name: 'Saúde', value: 300 },
        { name: 'Educação', value: 400 },
        { name: 'Outros', value: 350 },
    ];

    const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className='min-h-screen flex flex-col'>
            <HeaderBar />
            <div className="min-h-screen flex flex-col">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <ModalDemo />
                        <div className="flex items-center justify-between space-y-2">
                            <Button variant="ghost" size="icon" asChild className="shrink-0">
                                <Link href="/dashboard">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl md:text-3xl font-bold">Relatórios</h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={timeRange === 'week' ? 'default' : 'outline'}
                                        onClick={() => setTimeRange('week')}
                                    >
                                        Semana
                                    </Button>
                                    <Button
                                        variant={timeRange === 'month' ? 'default' : 'outline'}
                                        onClick={() => setTimeRange('month')}
                                    >
                                        Mês
                                    </Button>
                                    <Button
                                        variant={timeRange === 'year' ? 'default' : 'outline'}
                                        onClick={() => setTimeRange('year')}
                                    >
                                        Ano
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={chartType === 'bar' ? 'default' : 'outline'}
                                        onClick={() => setChartType('bar')}
                                    >
                                        Barras
                                    </Button>
                                    <Button
                                        variant={chartType === 'pie' ? 'default' : 'outline'}
                                        onClick={() => setChartType('pie')}
                                    >
                                        Pizza
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Gastos por Categoria</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'bar' ? (
                                        <BarChart data={categoryData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [
                                                    new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(Number(value)),
                                                    'Valor'
                                                ]}
                                            />
                                            <Legend />
                                            <Bar dataKey="value" name="Gastos" fill="#8884d8">
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    ) : (
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#000"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                        >
                                                            {`${name} ${(percent * 100).toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [
                                                    new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(Number(value)),
                                                    'Valor'
                                                ]}
                                            />
                                            <Legend />
                                        </PieChart>
                                    )}
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Período</p>
                                            <p className="font-medium">
                                                {timeRange === 'week' ? 'Últimos 7 dias' :
                                                    timeRange === 'month' ? 'Este mês' : 'Este ano'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total de Gastos</p>
                                            <p className="text-2xl font-bold text-red-500">
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(totalExpenses)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Categorias</p>
                                            <p className="font-medium">{categoryData.length} categorias</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Categorias</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[...categoryData]
                                            .sort((a, b) => b.value - a.value)
                                            .slice(0, 5)
                                            .map((category, index) => (
                                                <div key={category.name} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>{category.name}</span>
                                                        <span className="font-medium">
                                                            {new Intl.NumberFormat('pt-BR', {
                                                                style: 'currency',
                                                                currency: 'BRL'
                                                            }).format(category.value)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{
                                                                width: `${(category.value / totalExpenses) * 100}%`,
                                                                backgroundColor: COLORS[index % COLORS.length]
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-muted-foreground text-right">
                                                        {((category.value / totalExpenses) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
