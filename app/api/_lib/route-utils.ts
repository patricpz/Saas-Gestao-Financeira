import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

type HandlerContext = {
  params: Record<string, string>;
};

type HandlerExtra = {
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>;
  user: User;
};

type Handler = (
  request: NextRequest,
  context: HandlerContext,
  extra: HandlerExtra
) => Promise<NextResponse>;

export const createApiRouteHandler = (handler: (req: NextRequest, context: HandlerContext, extra: HandlerExtra) => Promise<NextResponse>) => {
  return async (request: NextRequest, context: HandlerContext) => {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const user: User = {
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata
      };
      
      return await handler(request, context, { supabase, user });
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
};

// O withAuth agora é apenas um wrapper que garante que o usuário está autenticado
export const withAuth = (handler: Handler) => {
  return async (request: NextRequest, context: HandlerContext, extra: HandlerExtra) => {
    // A autenticação já foi feita no createApiRouteHandler
    return handler(request, context, extra);
  };
};
