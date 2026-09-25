import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Verify DB Connection
    await prisma.$queryRaw`SELECT 1`;

    // 2. Fetch Entity Summary
    const [userCount, courseCount, testCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.test.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "healthy",
      timestamp: new Date().toISOString(),
      counts: {
        users: userCount,
        courses: courseCount,
        tests: testCount,
      },
    });
  } catch (error) {
    console.error("Health check database error:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
