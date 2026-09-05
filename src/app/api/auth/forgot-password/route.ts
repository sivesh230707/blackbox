import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid academic email address.'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Password reset instructions sent to ${email}. Please check your inbox.`,
      email
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: 'Password reset service error.'
    }, { status: 500 });
  }
}
