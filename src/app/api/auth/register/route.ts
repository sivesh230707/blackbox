import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, department, rollNumber } = body || {};

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'A valid university or student email is required.'
      }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters.'
      }, { status: 400 });
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: email.trim().toLowerCase(),
      name: name || email.split('@')[0],
      department: department || 'Engineering & Computer Science',
      rollNumber: rollNumber || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'Student',
      enrolledCourses: ["EE-201", "PHY-104", "CS-210"]
    };

    return NextResponse.json({
      success: true,
      message: 'Student account registered successfully.',
      token: `bb_token_${Date.now()}_${newUser.id}`,
      user: newUser
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: 'Registration service error.'
    }, { status: 500 });
  }
}
