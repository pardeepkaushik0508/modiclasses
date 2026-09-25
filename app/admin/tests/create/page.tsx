import { prisma } from "@/lib/prisma";
import TestBuilderClient from "./test-builder-client";

export const metadata = {
  title: "RDSO Psycho Test Builder | Admin Console - Five Education",
  description: "Create and publish RDSO CBT Psycho battery tests with dual phases and itemized question uploads.",
};

export default async function CreateTestPage() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <TestBuilderClient courses={courses} />;
}
