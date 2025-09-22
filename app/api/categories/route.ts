import { NextResponse, type NextRequest } from 'next/server';
import { createApiRouteHandler, withAuth } from '../_lib/route-utils';
import type { Database } from '@/types/supabase';

// Rota para buscar categorias do usuário
export const GET = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
          { error: 'Failed to fetch categories' },
          { status: 500 }
        );
      }

      return NextResponse.json(categories);
    })
  );

  return handler(request, { params: {} });
};

// Rota para criar uma nova categoria
export const POST = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { name, type, color, icon } = await req.json();

      if (!name || !type) {
        return NextResponse.json(
          { error: 'Name and type are required' },
          { status: 400 }
        );
      }

      const { data: category, error } = await supabase
        .from('categories')
        .insert([
          {
            user_id: user.id,
            name,
            type,
            color: color || '#6b7280', // Cor padrão
            icon: icon || 'dollar-sign',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
          { error: 'Failed to create category' },
          { status: 500 }
        );
      }

      return NextResponse.json(category, { status: 201 });
    })
  );

  return handler(request, { params: {} });
};
