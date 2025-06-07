// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/app/config/dbConfig';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();


    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "engineer",
    });

    return NextResponse.json({
      message: 'User registered successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
