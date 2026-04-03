import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
      await User.create({ email, password });
      return NextResponse.json({ message: "User Registered Successfully" });
    }
  } catch (error) {
    console.log("Registration Error", error);
    return NextResponse.json(
      { error: "Internal Server Error Failed to Register User" },
      { status: 500 },
    );
  }
}
