import { checkUser, createUser } from "@/handlers/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  try {
    const existingUserId = await checkUser(username, password);

    if (existingUserId) {
      return NextResponse.json({
        error: "User already exists",
        id: existingUserId,
      }, { status: 409 });
    }

    const userId = await createUser(username, password);

    if (!userId) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      id: userId,
    }, { status: 201 })

  } catch (e) {
    console.error("Error during signup:", e);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
