import { NextResponse, type NextRequest } from 'next/server';
import { createApiRouteHandler, withAuth } from '../_lib/route-utils';
import type { Database } from '@/types/supabase';

export const GET = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { searchParams } = new URL(req.url);
      const limit = searchParams.get('limit') || '10';

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(parseInt(limit));

      if (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
          { error: 'Failed to fetch transactions' },
          { status: 500 }
        );
      }

      return NextResponse.json(transactions);
    })
  );

  return handler(request, { params: {} });
};

export const POST = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { amount, description, type, category, date } = await req.json();

      if (!amount || !description || !type || !category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            amount,
            description,
            type,
            category,
            date: date || new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json(
          { error: 'Failed to create transaction' },
          { status: 500 }
        );
      }

      return NextResponse.json(transaction, { status: 201 });
    })
  );

  return handler(request, { params: {} });
};

// export const DELETE = async (
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   const handler = createApiRouteHandler(
//     withAuth(async (_req: NextRequest, _ctx: any, { supabase, user }) => {
//       const { id } = params;

//       if (!id) {
//         return NextResponse.json(
//           { error: 'Transaction ID is required' },
//           { status: 400 }
//         );
//       }

//       // Verifica se a transação pertence ao usuário
//       const { data: transaction, error: fetchError } = await supabase
//         .from('transactions')
//         .select('id')
//         .eq('id', id)
//         .eq('user_id', user.id)
//         .single();

//       if (fetchError || !transaction) {
//         return NextResponse.json(
//           { error: 'Transaction not found or access denied' },
//           { status: 404 }
//         );
//       }

//       // Se chegou aqui, pode deletar
//       const { error: deleteError } = await supabase
//         .from('transactions')
//         .delete()
//         .eq('id', id);

//       if (deleteError) {
//         console.error('Error deleting transaction:', deleteError);
//         return NextResponse.json(
//           { error: 'Failed to delete transaction' },
//           { status: 500 }
//         );
//       }

//       return new NextResponse(null, { status: 204 });
//     })
//   );

//   return handler(request, { params });
// };