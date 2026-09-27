"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin privileges required.");
  }
  return session.user;
}

export interface MaterialFormData {
  courseId: string;
  title: string;
  fileUrl: string;
  fileType: string; // 'PDF' | 'VIDEO' | 'DOC'
  duration?: string | null;
  isFree?: boolean;
}

export async function createStudyMaterial(data: MaterialFormData) {
  try {
    await ensureAdmin();

    if (!data.title?.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!data.courseId) {
      return { success: false, error: "Course link is required." };
    }
    if (!data.fileUrl?.trim()) {
      return { success: false, error: "File URL / Upload is required." };
    }

    const material = await prisma.studyMaterial.create({
      data: {
        title: data.title.trim(),
        courseId: data.courseId,
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType || "PDF",
        duration: data.duration?.trim() || null,
        isFree: Boolean(data.isFree),
      },
    });

    revalidatePath("/admin/materials");
    revalidatePath("/study-material");
    revalidatePath("/video");

    return { success: true, material };
  } catch (err: any) {
    console.error("createStudyMaterial error:", err);
    return { success: false, error: err.message || "Failed to create material." };
  }
}

export async function updateStudyMaterial(id: string, data: Partial<MaterialFormData>) {
  try {
    await ensureAdmin();

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.courseId !== undefined) updateData.courseId = data.courseId;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl.trim();
    if (data.fileType !== undefined) updateData.fileType = data.fileType;
    if (data.duration !== undefined) updateData.duration = data.duration?.trim() || null;
    if (data.isFree !== undefined) updateData.isFree = Boolean(data.isFree);

    const material = await prisma.studyMaterial.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/materials");
    revalidatePath("/study-material");
    revalidatePath("/video");

    return { success: true, material };
  } catch (err: any) {
    console.error("updateStudyMaterial error:", err);
    return { success: false, error: err.message || "Failed to update material." };
  }
}

export async function deleteStudyMaterial(id: string) {
  try {
    await ensureAdmin();

    await prisma.studyMaterial.delete({
      where: { id },
    });

    revalidatePath("/admin/materials");
    revalidatePath("/study-material");
    revalidatePath("/video");

    return { success: true };
  } catch (err: any) {
    console.error("deleteStudyMaterial error:", err);
    return { success: false, error: err.message || "Failed to delete material." };
  }
}
