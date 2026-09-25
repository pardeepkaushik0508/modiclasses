import { prisma } from "@/lib/prisma";
import MaterialsClient from "./materials-client";

export const metadata = {
  title: "Uploaded Materials | Admin Console - Five Education",
  description: "Manage PDFs, notes, and study material files for courses.",
};

export default async function AdminMaterialsPage() {
  const [materials, courses] = await Promise.all([
    prisma.studyMaterial.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <MaterialsClient initialMaterials={materials} courses={courses} />;
}
