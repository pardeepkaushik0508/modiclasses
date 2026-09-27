import { prisma } from "@/lib/prisma";
import CoursesClient from "./courses-client";

export const metadata = {
  title: "Manage Courses | Admin Console - PI EDUCATION",
  description: "Create, edit, price, and publish courses for PI EDUCATION LMS.",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          tests: true,
          studyMaterials: true,
          orders: true,
        },
      },
    },
  });

  return <CoursesClient initialCourses={courses} />;
}
