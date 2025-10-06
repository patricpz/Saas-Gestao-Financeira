import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { profileUtils } from '@/lib/profile-utils';

interface ProfileData {
  fullName?: string;
  avatarUrl?: string;
  currency?: string;
}

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const profile = await profileUtils.findByUserId(session.user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const { fullName, avatarUrl, currency } = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Validate input data
    const profileData: ProfileData = {
      fullName: fullName || undefined,
      avatarUrl: avatarUrl || undefined,
      currency: currency || 'BRL'
    };

    // Use the profile utility to upsert the profile
    const profile = await profileUtils.upsertByUserId(session.user.id, profileData);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
};
