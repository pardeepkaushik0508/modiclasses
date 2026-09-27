import { prisma } from "@/lib/prisma";
import CouponsClient, { SerializedCoupon } from "./coupons-client";

export const metadata = {
  title: "Coupons & Discounts | Admin Console - PI EDUCATION",
  description: "Create, manage, and monitor promotional discount coupons for PI EDUCATION LMS.",
};

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const rawCoupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          usages: true,
          orders: true,
        },
      },
    },
  });

  const coupons: SerializedCoupon[] = rawCoupons.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minOrderAmount: c.minOrderAmount,
    maxDiscountAmount: c.maxDiscountAmount,
    validUntil: c.validUntil ? c.validUntil.toISOString() : null,
    usageLimit: c.usageLimit,
    isPublished: c.isPublished,
    createdAt: c.createdAt.toISOString(),
    _count: c._count,
  }));

  return <CouponsClient coupons={coupons} />;
}
