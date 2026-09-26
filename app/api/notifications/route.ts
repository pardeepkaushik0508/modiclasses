import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export interface NotificationItem {
  id: string;
  type: "COURSE" | "TEST" | "MATERIAL" | "ANNOUNCEMENT";
  title: string;
  message: string;
  link: string;
  createdAt: string;
  formattedDate: string;
}

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

export async function GET() {
  try {
    const [courses, materials, tests, announcements] = await Promise.all([
      prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, createdAt: true },
      }),
      prisma.studyMaterial.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, fileType: true, createdAt: true },
      }),
      prisma.test.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, createdAt: true },
      }),
      prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const raw: Array<{
      id: string;
      type: "COURSE" | "TEST" | "MATERIAL" | "ANNOUNCEMENT";
      title: string;
      message: string;
      link: string;
      date: Date;
    }> = [];

    for (const c of courses) {
      raw.push({
        id: `notif-c-${c.id}`,
        type: "COURSE",
        title: "New Course Published",
        message: c.title,
        link: "/#courses",
        date: c.createdAt,
      });
    }

    for (const m of materials) {
      raw.push({
        id: `notif-m-${m.id}`,
        type: "MATERIAL",
        title: `New Study Material (${m.fileType || "PDF"})`,
        message: m.title,
        link: "/study-material",
        date: m.createdAt,
      });
    }

    for (const t of tests) {
      raw.push({
        id: `notif-t-${t.id}`,
        type: "TEST",
        title: "New CBT Practice Battery",
        message: t.title,
        link: `/test/${t.slug || t.id}`,
        date: t.createdAt,
      });
    }

    for (const a of announcements) {
      raw.push({
        id: `notif-a-${a.id}`,
        type: "ANNOUNCEMENT",
        title: a.title,
        message: a.subtitle,
        link: "/#announcements",
        date: a.createdAt,
      });
    }

    raw.sort((a, b) => b.date.getTime() - a.date.getTime());
    const top10 = raw.slice(0, 10);

    const notifications: NotificationItem[] = top10.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      link: item.link,
      createdAt: item.date.toISOString(),
      formattedDate: formatNotificationDate(item.date),
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("Notifications API error:", error);
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}
