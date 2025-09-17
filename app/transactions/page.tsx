import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsPage() {
  // Mock data - replace with actual data from your API
  const transactions = [
    { id: 1, description: 'Salário', amount: 5000.00, type: 'income', category: 'Salário', date: '2023-05-15' },
    { id: 2, description: 'Mercado', amount: 350.50, type: 'expense', category: 'Alimentação', date: '2023-05-14' },
    { id: 3, description: 'Aluguel', amount: 1200.00, type: 'expense', category: 'Moradia', date: '2023-05-10' },
    { id: 4, description: 'Internet', amount: 120.00, type: 'expense', category: 'Contas', date: '2023-05-08' },
    { id: 5, description: 'Freelance', amount: 2500.00, type: 'income', category: 'Trabalho', date: '2023-05-05' },
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Transações</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild className="gap-2">
            <Link href="/transactions/new">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Total de Transações</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-500">
            +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-500">
            -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
