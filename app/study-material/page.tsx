import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import StudyMaterialClient, { SerializedStudyMaterial } from "./study-material-client";

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

  const materials: SerializedStudyMaterial[] = materialsRaw.map((m) => ({
    id: m.id,
    title: m.title,
    fileUrl: m.fileUrl,
    fileType: m.fileType,
    isFree: m.isFree,
    createdAt: m.createdAt.toISOString(),
    course: m.course,
  }));

  // 2. Resolve Candidate Enrollment Access
  let enrolledCourseIds: string[] = [];
  const isAdmin = session?.user?.role === "ADMIN";

  if (session?.user?.id && !isAdmin) {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: OrderStatus.SUCCESS,
      },
      select: { courseId: true },
    });
    enrolledCourseIds = orders.map((o) => o.courseId);
  }

  return (
    <StudyMaterialClient
      materials={materials}
      enrolledCourseIds={enrolledCourseIds}
      isAdmin={isAdmin}
    />
  );
}
