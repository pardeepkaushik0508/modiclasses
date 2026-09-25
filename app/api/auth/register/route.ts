import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Generates a unique 6-digit CBT format roll number (e.g., '420101', '428941').
 * Retries if a collision occurs.
 */
async function generateUniqueRollNo(): Promise<string> {
  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate 6-digit number starting with 42 (e.g. 420000 - 429999) or standard 6-digit
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit
    const candidateRoll = `42${randomSuffix}`;

    const existing = await prisma.user.findUnique({
      where: { rollNo: candidateRoll },
      select: { id: true },
    });

    if (!existing) {
      return candidateRoll;
    }
  }

  // Fallback to random 6-digit string if prefix range is congested
  const fallback = Math.floor(100000 + Math.random() * 900000).toString();
  return fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    // 1. Validate Required Fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone && typeof phone === "string" ? phone.trim() : null;

    // Optional phone validation: if provided, check minimum 10 digits
    if (cleanPhone) {
      const numericOnly = cleanPhone.replace(/\D/g, "");
      if (numericOnly.length < 10) {
        return NextResponse.json(
          { error: "Phone number must contain at least 10 digits." },
          { status: 400 }
        );
      }
    }

    // 2. Check for Duplicate Email
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please login." },
        { status: 409 }
      );
    }

    // 3. Check for Duplicate Phone (if provided)
    if (cleanPhone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: cleanPhone },
        select: { id: true },
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number is already registered." },
          { status: 409 }
        );
      }
    }

    // 4. Hash Password with bcryptjs (salt rounds: 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Generate Unique 6-Digit RDSO CBT Roll Number
    const rollNo = await generateUniqueRollNo();

    // 6. Create User in Database with Role STUDENT
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: Role.STUDENT,
        rollNo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        rollNo: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! You can now log in.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
