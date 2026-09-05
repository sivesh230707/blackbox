import { NextRequest, NextResponse } from 'next/server';

const waitlistSubmissions: any[] = [
  {
    id: "wl-001",
    email: "dean.academics@mit.edu",
    submittedAt: "2026-09-04T14:22:00Z",
    institution: "MIT",
    status: "Verified"
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, institution } = body || {};

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'A valid institutional or student email address is required.'
      }, { status: 400 });
    }

    const existing = waitlistSubmissions.find(w => w.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Email is already registered for prototype pilot.',
        data: existing
      });
    }

    const newEntry = {
      id: `wl-${Date.now().toString().slice(-4)}`,
      email: email.trim().toLowerCase(),
      role: role || 'Student / Faculty',
      institution: institution || (email.split('@')[1] || 'Academic Institution'),
      submittedAt: new Date().toISOString(),
      status: 'Received'
    };

    waitlistSubmissions.push(newEntry);

    return NextResponse.json({
      success: true,
      message: 'Prototype pilot request received successfully.',
      data: newEntry
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to register waitlist email.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    count: waitlistSubmissions.length,
    data: waitlistSubmissions
  });
}
