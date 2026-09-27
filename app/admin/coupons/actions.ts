"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DiscountType } from "@prisma/client";

// Security helper: strict role check
async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin privileges required.");
  }
  return session.user;
}

export interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  validUntil?: string | null;
  usageLimit?: number | null;
  isPublished?: boolean;
}

export async function createCouponAction(data: CouponFormData) {
  try {
    await ensureAdmin();

    const cleanCode = data.code?.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 3) {
      return { success: false, error: "Coupon code must be at least 3 characters long." };
    }

    if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
      return { success: false, error: "Coupon code can only contain uppercase letters, numbers, and dashes." };
    }

    const discountVal = Number(data.discountValue);
    if (isNaN(discountVal) || discountVal <= 0) {
      return { success: false, error: "Please provide a valid discount value greater than 0." };
    }

    if (data.discountType === "PERCENTAGE" && discountVal > 100) {
      return { success: false, error: "Percentage discount cannot exceed 100%." };
    }

    // Check collision
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });
    if (existing) {
      return { success: false, error: `Coupon code '${cleanCode}' already exists.` };
    }

    const minOrder = Number(data.minOrderAmount) || 0;
    const maxDiscount = data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null;
    const usageLimit = data.usageLimit ? Number(data.usageLimit) : null;
    const validUntil = data.validUntil ? new Date(data.validUntil) : null;

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: data.discountType || "PERCENTAGE",
        discountValue: discountVal,
        minOrderAmount: minOrder,
        maxDiscountAmount: maxDiscount,
        validUntil,
        usageLimit,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success: true, coupon };
  } catch (err: any) {
    console.error("createCouponAction error:", err);
    return { success: false, error: err.message || "Failed to create coupon." };
  }
}

export async function toggleCouponStatusAction(id: string) {
  try {
    await ensureAdmin();

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!coupon) {
      return { success: false, error: "Coupon not found." };
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isPublished: !coupon.isPublished },
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success: true, isPublished: updated.isPublished };
  } catch (err: any) {
    console.error("toggleCouponStatusAction error:", err);
    return { success: false, error: err.message || "Failed to update coupon status." };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    await ensureAdmin();

    await prisma.coupon.delete({
      where: { id },
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: any) {
    console.error("deleteCouponAction error:", err);
    return { success: false, error: err.message || "Failed to delete coupon." };
  }
}
