import { prisma } from "@/lib/prisma";
import StudentsClient from "./students-client";

export const metadata = {
  title: "Students Directory | Admin Console - PI EDUCATION",
  description: "View registered students and candidates for PI EDUCATION LMS.",
};

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      rollNo: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          attempts: true,
        },
      },
    },
  });

  return <StudentsClient students={students} />;
}
