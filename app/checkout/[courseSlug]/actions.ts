"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface ValidateCouponPayload {
  courseSlug: string;
  couponCode?: string | null;
}

export interface CouponValidationResult {
  success: boolean;
  error?: string;
  coupon?: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FLAT";
    discountValue: number;
    maxDiscountAmount?: number | null;
  } | null;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface CreateOrderResult {
  success: boolean;
  error?: string;
  requireLogin?: boolean;
  alreadyEnrolled?: boolean;
  orderId?: string;
  gatewayOrderId?: string | null;
  amount?: number;
  isMock?: boolean;
  currency?: string;
  keyId?: string | null;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId?: string;
  signature?: string;
  simulatedSuccess?: boolean;
}

export interface VerifyPaymentResult {
  success: boolean;
  error?: string;
  courseSlug?: string;
  orderId?: string;
}

/**
 * 1. SERVER-SIDE COUPON VALIDATION
 * Strictly calculates all prices from database without trusting any client payload
 */
export async function validateCouponAction({
  courseSlug,
  couponCode,
}: ValidateCouponPayload): Promise<CouponValidationResult> {
  try {
    const session = await getServerSession(authOptions);

    // 1. Fetch course directly from PostgreSQL
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ slug: courseSlug }, { id: courseSlug }],
      },
    });

    if (!course) {
      return {
        success: false,
        error: "Course not found.",
        baseAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
      };
    }

    const baseAmount = course.discountedPrice ?? course.price;

    // If no coupon provided, return authentic base price
    const cleanCode = couponCode?.trim().toUpperCase();
    if (!cleanCode) {
      return {
        success: true,
        coupon: null,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    // 2. Fetch coupon by code (case-insensitive)
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: { equals: cleanCode, mode: "insensitive" },
      },
    });

    if (!coupon) {
      return {
        success: false,
        error: `Coupon code "${cleanCode}" is invalid.`,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    if (!coupon.isPublished) {
      return {
        success: false,
        error: `Coupon "${cleanCode}" is no longer active.`,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    // Check expiry date
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return {
        success: false,
        error: `Coupon "${cleanCode}" has expired.`,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    // Check minimum order value
    if (baseAmount < coupon.minOrderAmount) {
      return {
        success: false,
        error: `Coupon requires a minimum course value of ₹${coupon.minOrderAmount}.`,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    // Check total global usage limit
    if (coupon.usageLimit) {
      const totalUsages = await prisma.couponUsage.count({
        where: { couponId: coupon.id },
      });
      if (totalUsages >= coupon.usageLimit) {
        return {
          success: false,
          error: `Coupon "${cleanCode}" has reached its maximum redemption limit.`,
          baseAmount,
          discountAmount: 0,
          finalAmount: baseAmount,
        };
      }
    }

    // Check single-use per candidate rule (only for completed success orders)
    if (session?.user?.id) {
      const alreadyRedeemed = await prisma.couponUsage.findUnique({
        where: {
          couponId_userId: {
            couponId: coupon.id,
            userId: session.user.id,
          },
        },
      });

      if (alreadyRedeemed) {
        return {
          success: false,
          error: `You have already redeemed coupon "${cleanCode}".`,
          baseAmount,
          discountAmount: 0,
          finalAmount: baseAmount,
        };
      }
    }

    // 3. Calculate exact discount on server
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((baseAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(baseAmount, coupon.discountValue);
    }

    discountAmount = Math.max(0, discountAmount);
    const finalAmount = Math.max(0, baseAmount - discountAmount);

    return {
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      baseAmount,
      discountAmount,
      finalAmount,
    };
  } catch (err: any) {
    console.error("validateCouponAction error:", err);
    return {
      success: false,
      error: "Failed to validate coupon.",
      baseAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
    };
  }
}

/**
 * 2. CREATE ORDER & INITIALIZE PAYMENT
 * Re-validates all pricing server-side, creates PENDING order without burning coupon
 */
export async function createOrderAction({
  courseSlug,
  couponCode,
}: ValidateCouponPayload): Promise<CreateOrderResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        requireLogin: true,
        error: "Please log in to complete your course enrollment.",
      };
    }

    // 1. Fetch course
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ slug: courseSlug }, { id: courseSlug }],
      },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    // 2. Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return {
        success: false,
        alreadyEnrolled: true,
        error: "You are already enrolled in this course!",
      };
    }

    const existingSuccessOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
        status: OrderStatus.SUCCESS,
      },
    });

    if (existingSuccessOrder) {
      return {
        success: false,
        alreadyEnrolled: true,
        error: "You are already enrolled in this course!",
      };
    }

    // 3. Re-validate coupon server-side
    const validation = await validateCouponAction({ courseSlug, couponCode });
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const { baseAmount, discountAmount, finalAmount, coupon } = validation;

    // 4. Create PENDING Order in Database
    // NOTE: CouponUsage is deliberately NOT created here. It is only recorded upon SUCCESS!
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        baseAmount,
        discountAmount,
        finalAmount,
        amount: finalAmount,
        status: OrderStatus.PENDING,
        couponId: coupon ? coupon.id : null,
      },
    });

    // 5. Gateway Resolution (Razorpay vs Mock Simulator)
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    const isProductionRazorpay = Boolean(
      razorpayKeyId &&
      razorpayKeySecret &&
      !razorpayKeyId.includes("dummy") &&
      !razorpayKeyId.includes("change_me")
    );

    if (isProductionRazorpay) {
      try {
        // Direct call to Razorpay Orders API
        const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify({
            amount: Math.round(finalAmount * 100), // in paise
            currency: "INR",
            receipt: order.id,
            notes: {
              userId: session.user.id,
              courseId: course.id,
              courseTitle: course.title,
            },
          }),
        });

        if (rzpRes.ok) {
          const rzpOrder = await rzpRes.json();
          await prisma.order.update({
            where: { id: order.id },
            data: { gatewayOrderId: rzpOrder.id },
          });

          return {
            success: true,
            orderId: order.id,
            gatewayOrderId: rzpOrder.id,
            amount: finalAmount,
            isMock: false,
            currency: "INR",
            keyId: razorpayKeyId,
          };
        }
      } catch (rzpErr) {
        console.error("Razorpay API order creation failed, falling back to mock mode:", rzpErr);
      }
    }

    // Secure Mock Simulator Mode
    const mockGatewayId = `mock_order_${Date.now()}_${order.id.slice(-6)}`;
    await prisma.order.update({
      where: { id: order.id },
      data: { gatewayOrderId: mockGatewayId },
    });

    return {
      success: true,
      orderId: order.id,
      gatewayOrderId: mockGatewayId,
      amount: finalAmount,
      isMock: true,
      currency: "INR",
      keyId: null,
    };
  } catch (err: any) {
    console.error("createOrderAction error:", err);
    return { success: false, error: err.message || "Failed to create order." };
  }
}

/**
 * 3. VERIFY PAYMENT & ENROLL CANDIDATE
 * Atomically marks order SUCCESS, upserts Enrollment, records CouponUsage, and revalidates access
 */
export async function verifyPaymentAction({
  orderId,
  paymentId,
  signature,
  simulatedSuccess,
}: VerifyPaymentPayload): Promise<VerifyPaymentResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized session." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order || order.userId !== session.user.id) {
      return { success: false, error: "Order not found or unauthorized access." };
    }

    // Already succeeded
    if (order.status === OrderStatus.SUCCESS) {
      return { success: true, courseSlug: order.course.slug, orderId: order.id };
    }

    // 1. MOCK SIMULATOR VERIFICATION
    if (simulatedSuccess !== undefined) {
      if (!simulatedSuccess) {
        // Mark FAILED, do NOT record coupon usage!
        await prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.FAILED },
        });

        return {
          success: false,
          error: "Payment was not completed. Your coupon code remains intact.",
        };
      }

      // Succeeded in mock mode -> Execute transaction
      await prisma.$transaction(async (tx) => {
        // 1. Mark Order SUCCESS
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.SUCCESS,
            gatewayOrderId: paymentId || `mock_pay_${Date.now()}`,
          },
        });

        // 2. Create Enrollment
        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: order.courseId,
            },
          },
          update: {},
          create: {
            userId: order.userId,
            courseId: order.courseId,
          },
        });

        // 3. Atomically record CouponUsage if coupon was applied
        if (order.couponId) {
          await tx.couponUsage.upsert({
            where: {
              couponId_userId: {
                couponId: order.couponId,
                userId: order.userId,
              },
            },
            update: {
              orderId: order.id,
              usedAt: new Date(),
            },
            create: {
              couponId: order.couponId,
              userId: order.userId,
              orderId: order.id,
            },
          });
        }
      });

      // Instant revalidation
      revalidatePath("/");
      revalidatePath("/dashboard");
      revalidatePath("/study-material");
      revalidatePath("/video");
      revalidatePath(`/checkout/${order.course.slug}`);

      return { success: true, courseSlug: order.course.slug, orderId: order.id };
    }

    // 2. PRODUCTION RAZORPAY VERIFICATION
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!razorpayKeySecret || !order.gatewayOrderId || !paymentId || !signature) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED },
      });
      return { success: false, error: "Payment verification parameters missing." };
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${order.gatewayOrderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED },
      });
      return { success: false, error: "Cryptographic payment signature mismatch." };
    }

    // Valid Razorpay Signature -> Execute Transaction
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.SUCCESS,
          gatewayOrderId: paymentId,
        },
      });

      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: order.userId,
            courseId: order.courseId,
          },
        },
        update: {},
        create: {
          userId: order.userId,
          courseId: order.courseId,
        },
      });

      if (order.couponId) {
        await tx.couponUsage.upsert({
          where: {
            couponId_userId: {
              couponId: order.couponId,
              userId: order.userId,
            },
          },
          update: {
            orderId: order.id,
            usedAt: new Date(),
          },
          create: {
            couponId: order.couponId,
            userId: order.userId,
            orderId: order.id,
          },
        });
      }
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/study-material");
    revalidatePath("/video");
    revalidatePath(`/checkout/${order.course.slug}`);

    return { success: true, courseSlug: order.course.slug, orderId: order.id };
  } catch (err: any) {
    console.error("verifyPaymentAction error:", err);
    return { success: false, error: err.message || "Failed to verify payment." };
  }
}
