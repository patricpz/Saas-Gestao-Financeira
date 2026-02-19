'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Transaction as TransactionType } from "@/lib/types/domain";

interface CardTranslationProps {
    transactions: TransactionType[];
    formatCurrency: (value: number) => string;
}

export default function CardTranslation({ transactions, formatCurrency }: CardTranslationProps) {

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-2xl font-semibold text-slate-900'>Recent Transactions</CardTitle>
                <Button variant="ghost" className='text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700' asChild>
                    <Link href="/dashboard/transactions">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 overflow-x-auto">
                    {transactions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                            Nenhuma transação recente encontrada.
                        </div>
                    ) : transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-medium text-slate-900">{transaction.description || 'Transação sem descrição'}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div
                                className={`font-semibold ${transaction.type === 'INCOME' ? 'text-blue-600' : 'text-slate-700'
                                    }`}
                            >
                                {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(Number(transaction.amount) || 0)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}