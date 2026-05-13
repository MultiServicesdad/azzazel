export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { registerUser } from '@/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, username, password } = result.data;

    const { user, verifyToken } = await registerUser({
      email,
      username,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please verify your email.',
        data: {
          user,
          // In production, verifyToken would be sent via email only
          ...(process.env.NODE_ENV === 'development' && { verifyToken }),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    const status = message.includes('already') ? 409 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
