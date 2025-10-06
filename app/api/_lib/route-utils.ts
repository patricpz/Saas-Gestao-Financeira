import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

type HandlerContext = {
  params: Record<string, string>;
};

type HandlerExtra = {
  user: User;
};

type Handler = (
  request: NextRequest,
  context: HandlerContext,
  extra: HandlerExtra
) => Promise<NextResponse>;

export const createApiRouteHandler = (handler: Handler) => {
  return async (request: NextRequest, context: HandlerContext) => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image
      };
      
      return await handler(request, context, { user });
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
