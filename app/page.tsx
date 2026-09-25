import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

// Ensure fresh data on request
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // 1. DYNAMIC COURSES: Pull published courses directly from PostgreSQL via Prisma ORM
  const coursesRaw = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });

  // Serialize courses for client component
  const courses = coursesRaw.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    price: course.price,
    discountedPrice: course.discountedPrice,
    features: course.features && course.features.length > 0
      ? course.features
      : ["Practice Tests", "Video Classes", "Complete Preparation"],
    thumbnail: course.thumbnail,
  }));

  // 2. DYNAMIC ANNOUNCEMENTS: Query Latest Updates from DB
  const announcementsRaw = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const announcements = announcementsRaw.map((ann) => ({
    id: ann.id,
    title: ann.title,
    subtitle: ann.subtitle,
    category: ann.category,
    dateText: ann.dateText,
  }));

  // 3. DYNAMIC USER PROGRESS: Calculate from actual TestAttempt records in PostgreSQL
  const totalPublishedTests = await prisma.test.count({
    where: { isPublished: true },
  });

  let progressPercentage = 35; // Default reference preview mode
  let completedCount = 0;

  if (session?.user?.id) {
    completedCount = await prisma.testAttempt.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    });

    if (totalPublishedTests > 0) {
      progressPercentage = Math.min(
        100,
        Math.round((completedCount / totalPublishedTests) * 100)
      );
    } else {
      progressPercentage = 0;
    }
  }

  return (
    <DashboardClient
      courses={courses}
      announcements={announcements}
      progressPercentage={progressPercentage}
      completedCount={completedCount}
      totalTestsCount={totalPublishedTests}
      session={session}
    />
  );
}
