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

  const videos: SerializedVideoLesson[] = videosRaw.map((v) => ({
    id: v.id,
    title: v.title,
    fileUrl: v.fileUrl,
    isFree: v.isFree,
    createdAt: v.createdAt.toISOString(),
    course: v.course,
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
    <VideoClient
      videos={videos}
      enrolledCourseIds={enrolledCourseIds}
      isAdmin={isAdmin}
    />
  );
}
