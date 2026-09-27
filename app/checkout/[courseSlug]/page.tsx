import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckoutClient, {
  CheckoutCourseData,
  PublicCouponSuggestion,
  CandidateSessionData,
} from "./checkout-client";

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: courseSlug }, { id: courseSlug }],
    },
    select: { title: true },
  });

  return {
    title: course ? `Enroll in ${course.title} | PI EDUCATION` : "Course Checkout | PI EDUCATION",
    description: "Complete your enrollment in PI EDUCATION RDSO Psycho CBT training courses.",
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { courseSlug } = await params;

  // 1. Fetch course details directly from PostgreSQL via Prisma
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: courseSlug }, { id: courseSlug }],
      isPublished: true,
    },
  });

  if (!course) {
    notFound();
  }

  // 2. Fetch authenticated session
  const session = await getServerSession(authOptions);

  // 3. Check existing candidate enrollment status
  let isAlreadyEnrolled = false;
  if (session?.user?.id) {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    const existingSuccessOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
        status: "SUCCESS",
      },
    });

    isAlreadyEnrolled = Boolean(existingEnrollment || existingSuccessOrder);
  }

  // 4. Fetch active public coupon suggestions
  const availableCouponsRaw = await prisma.coupon.findMany({
    where: {
      isPublished: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ],
    },
    orderBy: { discountValue: "desc" },
    take: 5,
  });

  const availableCoupons: PublicCouponSuggestion[] = availableCouponsRaw.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minOrderAmount: c.minOrderAmount,
    maxDiscountAmount: c.maxDiscountAmount,
  }));

  const candidate: CandidateSessionData | null = session?.user
    ? {
      id: session.user.id,
      name: session.user.name || null,
      email: session.user.email || null,
      phone: (session.user as any).phone || null,
      rollNo: (session.user as any).rollNo || null,
    }
    : null;

  const courseData: CheckoutCourseData = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    price: course.price,
    discountedPrice: course.discountedPrice,
    validityDays: course.validityDays,
    features:
      course.features && course.features.length > 0
        ? course.features
        : [
          "Full RDSO Psycho CBT Simulation Access",
          "9 Battery Speed & Recall Tests",
          "Personalized T-Score Performance Metrics",
        ],
    thumbnail: course.thumbnail,
  };

  return (
    <CheckoutClient
      course={courseData}
      availableCoupons={availableCoupons}
      candidate={candidate}
      isAlreadyEnrolled={isAlreadyEnrolled}
    />
  );
}
