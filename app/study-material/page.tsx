import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import StudyMaterialClient, { SerializedStudyMaterial } from "./study-material-client";
import StudentAppLayout from "@/components/layout/student-app-layout";

export const dynamic = "force-dynamic";

export default async function StudyMaterialPage() {
  const session = await getServerSession(authOptions);

  // 1. Fetch all documents/PDF study materials from PostgreSQL via Prisma
  const materialsRaw = await prisma.studyMaterial.findMany({
    where: {
      fileType: { not: "VIDEO" },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountedPrice: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Resolve Candidate Enrollment Access
  let enrolledCourseIds: string[] = [];
  const isAdmin = session?.user?.role === "ADMIN";

  if (session?.user?.id && !isAdmin) {
    const [enrollments, orders] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
      }),
      prisma.order.findMany({
        where: {
          userId: session.user.id,
          status: OrderStatus.SUCCESS,
        },
        select: { courseId: true },
      }),
    ]);
    enrolledCourseIds = Array.from(
      new Set([
        ...enrollments.map((e) => e.courseId),
        ...orders.map((o) => o.courseId),
      ])
    );
  }

  // SECURITY: Only pass fileUrl if user is authenticated and authorized (enrolled, admin, or free preview)
  const materials: SerializedStudyMaterial[] = materialsRaw.map((m) => {
    const isAccessible = m.isFree || isAdmin || enrolledCourseIds.includes(m.course.id);
    return {
      id: m.id,
      title: m.title,
      fileUrl: isAccessible ? m.fileUrl : null,
      fileType: m.fileType,
      isFree: m.isFree,
      createdAt: m.createdAt.toISOString(),
      course: m.course,
    };
  });

  return (
    <StudentAppLayout>
      <StudyMaterialClient
        materials={materials}
        enrolledCourseIds={enrolledCourseIds}
        isAdmin={isAdmin}
      />
    </StudentAppLayout>
  );
}
