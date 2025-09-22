import { NextResponse, type NextRequest } from 'next/server';
import { createApiRouteHandler, withAuth } from '../_lib/route-utils';
import type { Database } from '@/types/supabase';

export const GET = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
          { error: 'Failed to fetch profile' },
          { status: 500 }
        );
      }

      return NextResponse.json(profile);
    })
  );

  return handler(request, { params: {} });
};

export const PATCH = async (request: NextRequest) => {
  const handler = createApiRouteHandler(
    withAuth(async (req: NextRequest, _: any, { supabase, user }) => {
      const { full_name, avatar_url, currency } = await req.json();

      const updates = {
        id: user.id,
        full_name,
        avatar_url,
        currency,
        updated_at: new Date().toISOString(),
      };

      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
          { error: 'Failed to update profile' },
          { status: 500 }
        );
      }

      return NextResponse.json(profile);
    })
  );

  return handler(request, { params: {} });
};
