import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import VideoClient, { SerializedVideoLesson } from "./video-client";

export const dynamic = "force-dynamic";

export default async function VideoClassesPage() {
  const session = await getServerSession(authOptions);

  // 1. Fetch all Video lessons from PostgreSQL via Prisma
  const videosRaw = await prisma.studyMaterial.findMany({
    where: {
      fileType: "VIDEO",
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
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

  // SECURITY: Only pass video fileUrl to client if user is authenticated and authorized (enrolled, admin, or free preview)
  const videos: SerializedVideoLesson[] = videosRaw.map((v) => {
    const isAccessible = v.isFree || isAdmin || enrolledCourseIds.includes(v.course.id);
    return {
      id: v.id,
      title: v.title,
      fileUrl: isAccessible ? v.fileUrl : null,
      isFree: v.isFree,
      createdAt: v.createdAt.toISOString(),
      course: v.course,
    };
  });

  return (
    <VideoClient
      videos={videos}
      enrolledCourseIds={enrolledCourseIds}
      isAdmin={isAdmin}
    />
  );
}
