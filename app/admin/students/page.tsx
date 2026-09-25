import { prisma } from "@/lib/prisma";
import StudentsClient from "./students-client";

export const metadata = {
  title: "Students Directory | Admin Console - Five Education",
  description: "View registered students and candidates for Five Education LMS.",
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
