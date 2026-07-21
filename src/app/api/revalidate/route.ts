import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Allow validation if secret matches NEXTAUTH_SECRET, OR if user has active session
    let isAuthorized = false;
    if (secret && secret === process.env.NEXTAUTH_SECRET) {
      isAuthorized = true;
    } else {
      const session = await getServerSession(authOptions);
      if (session) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  } catch (error: any) {
    console.error('Error revalidating path:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
