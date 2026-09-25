"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Security helper
async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin privileges required.");
  }
  return session.user;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export interface CourseFormData {
  title: string;
  slug?: string;
  description?: string;
  price: number;
  discountedPrice?: number | null;
  validityDays?: number;
  features?: string[];
  thumbnail?: string;
  isPublished?: boolean;
}

export async function createCourse(data: CourseFormData) {
  try {
    await ensureAdmin();

    if (!data.title?.trim()) {
      return { success: false, error: "Course title is required." };
    }

    if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
      return { success: false, error: "Valid price is required." };
    }

    let finalSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
    if (!finalSlug) {
      finalSlug = `course-${Date.now()}`;
    }

    // Check slug collision
    const existing = await prisma.course.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const course = await prisma.course.create({
      data: {
        title: data.title.trim(),
        slug: finalSlug,
        description: data.description?.trim() || null,
        price: Number(data.price),
        discountedPrice:
          data.discountedPrice !== undefined && data.discountedPrice !== null && !isNaN(Number(data.discountedPrice))
            ? Number(data.discountedPrice)
            : null,
        validityDays: Number(data.validityDays) || 365,
        features: Array.isArray(data.features) ? data.features.filter((f) => f.trim().length > 0) : [],
        thumbnail: data.thumbnail?.trim() || null,
        isPublished: Boolean(data.isPublished),
      },
    });

    // Instant revalidation so course immediately shows on user homepage
    revalidatePath("/");
    revalidatePath("/admin/courses");
    revalidatePath("/admin");

    return { success: true, course };
  } catch (err: any) {
    console.error("createCourse error:", err);
    return { success: false, error: err.message || "Failed to create course." };
  }
}

export async function updateCourse(id: string, data: Partial<CourseFormData>) {
  try {
    await ensureAdmin();

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.slug !== undefined) updateData.slug = slugify(data.slug);
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.discountedPrice !== undefined) {
      updateData.discountedPrice =
        data.discountedPrice !== null && !isNaN(Number(data.discountedPrice))
          ? Number(data.discountedPrice)
          : null;
    }
    if (data.validityDays !== undefined) updateData.validityDays = Number(data.validityDays);
    if (data.features !== undefined) {
      updateData.features = Array.isArray(data.features) ? data.features.filter((f) => f.trim().length > 0) : [];
    }
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail?.trim() || null;
    if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);

    const updated = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/courses");
    revalidatePath("/admin");

    return { success: true, course: updated };
  } catch (err: any) {
    console.error("updateCourse error:", err);
    return { success: false, error: err.message || "Failed to update course." };
  }
}

export async function togglePublishCourse(id: string) {
  try {
    await ensureAdmin();

    const course = await prisma.course.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { isPublished: !course.isPublished },
    });

    revalidatePath("/");
    revalidatePath("/admin/courses");
    revalidatePath("/admin");

    return { success: true, isPublished: updated.isPublished };
  } catch (err: any) {
    console.error("togglePublishCourse error:", err);
    return { success: false, error: err.message || "Failed to toggle status." };
  }
}

export async function deleteCourse(id: string) {
  try {
    await ensureAdmin();

    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/courses");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    console.error("deleteCourse error:", err);
    return { success: false, error: err.message || "Failed to delete course." };
  }
}
