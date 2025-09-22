'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/context/AuthContext";

export default function CardTranslation() {

    const balance = 12500.75;
    const income = 15000.0;
    const expenses = 2499.25;
    const recentTransactions = [
        { id: 1, description: 'Salário', amount: 5000.0, type: 'income', date: '2023-05-15' },
        { id: 2, description: 'Mercado', amount: 350.5, type: 'expense', date: '2023-05-14' },
        { id: 3, description: 'Aluguel', amount: 1200.0, type: 'expense', date: '2023-05-10' },
    ];

    const { user } = useAuth();

    console.log('user', user)

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Transações Recentes</CardTitle>
                <Button variant="outline" className='text-xs' asChild>
                    <Link href="/dashboard/transactions">Ver todas as transações</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 overflow-x-auto">
                    {recentTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border rounded-lg"
                        >
                            <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div
                                className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                    transaction.amount
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}