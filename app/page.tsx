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

  // 4. DYNAMIC NOTIFICATIONS: Query latest activities (courses, study materials, tests, announcements)
  const [recentCourses, recentMaterials, recentTests, recentAnnouncements] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, title: true, slug: true, createdAt: true },
    }),
    prisma.studyMaterial.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, title: true, fileType: true, createdAt: true },
    }),
    prisma.test.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, title: true, slug: true, createdAt: true },
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const rawNotifications: {
    id: string;
    type: "COURSE" | "TEST" | "MATERIAL" | "ANNOUNCEMENT";
    title: string;
    message: string;
    link: string;
    date: Date;
  }[] = [];

  for (const c of recentCourses) {
    rawNotifications.push({
      id: `notif-c-${c.id}`,
      type: "COURSE",
      title: "New Course Published",
      message: c.title,
      link: "/#courses",
      date: c.createdAt,
    });
  }

  for (const m of recentMaterials) {
    rawNotifications.push({
      id: `notif-m-${m.id}`,
      type: "MATERIAL",
      title: `New Study Material (${m.fileType || "PDF"})`,
      message: m.title,
      link: "/study-material",
      date: m.createdAt,
    });
  }

  for (const t of recentTests) {
    rawNotifications.push({
      id: `notif-t-${t.id}`,
      type: "TEST",
      title: "New CBT Practice Battery",
      message: t.title,
      link: `/test/${t.slug || t.id}`,
      date: t.createdAt,
    });
  }

  for (const a of recentAnnouncements) {
    rawNotifications.push({
      id: `notif-a-${a.id}`,
      type: "ANNOUNCEMENT",
      title: a.title,
      message: a.subtitle,
      link: "/#announcements",
      date: a.createdAt,
    });
  }

  rawNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());
  const top10 = rawNotifications.slice(0, 10);

  function formatNotificationDate(date: Date): string {
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `Today at ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Yesterday at ${timeStr}`;
    }

    const dateStr = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr}, ${timeStr}`;
  }

  const notifications = top10.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    message: item.message,
    link: item.link,
    createdAt: item.date.toISOString(),
    formattedDate: formatNotificationDate(item.date),
  }));

  return (
    <DashboardClient
      courses={courses}
      announcements={announcements}
      notifications={notifications}
      progressPercentage={progressPercentage}
      completedCount={completedCount}
      totalTestsCount={totalPublishedTests}
      session={session}
    />
  );
}
