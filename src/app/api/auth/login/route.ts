import { NextRequest, NextResponse } from 'next/server';

const users = [
  {
    id: "usr-01",
    email: "student@blackbox.edu",
    username: "student",
    password: "Blackbox123",
    name: "Alex Rivera",
    department: "Electrical & Computer Engineering",
    rollNumber: "ECE-2026-084",
    role: "Student",
    enrolledCourses: ["EE-201", "PHY-104", "CS-210"]
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Please provide both email/username and password.'
      }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      u.username.toLowerCase() === cleanEmail
    );

    if (user && user.password === password) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful. Redirecting to workspace.',
        token: `bb_token_${Date.now()}_${user.id}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          rollNumber: user.rollNumber,
          enrolledCourses: user.enrolledCourses
        }
      });
    }

    // Fallback demo convenience: allow student@* with Blackbox123
    if (password === 'Blackbox123' && cleanEmail.includes('@')) {
      const demoUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        name: cleanEmail.split('@')[0].toUpperCase(),
        role: 'Student',
        department: 'Computer Science & Engineering',
        rollNumber: 'CS-2026-DEMO',
        enrolledCourses: ["EE-201", "PHY-104"]
      };
      return NextResponse.json({
        success: true,
        message: 'Demo credentials accepted. Welcome to Blackbox workspace.',
        token: `bb_token_demo_${Date.now()}`,
        user: demoUser
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Incorrect password or unregistered email.',
      hint: 'Use student@blackbox.edu with password Blackbox123 for pilot access.'
    }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to authenticate user.'
    }, { status: 500 });
  }
}
