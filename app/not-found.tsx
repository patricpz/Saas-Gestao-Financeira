import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Página não encontrada</h2>
      <p className="mb-8 max-w-md text-gray-600">
        A página que você está procurando pode ter sido removida, ter mudado de nome ou está temporariamente indisponível.
      </p>
      <Button asChild>
        <Link href="/dashboard">
          Voltar para a página inicial
        </Link>
      </Button>
    </div>
  );
}
