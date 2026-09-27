import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import RDSOExamRunnerClient, { TestData } from "./rdso-runner-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RDSOExamRunnerPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Dynamic Database Ingestion from PostgreSQL via Prisma
  let test = null;
  if (id === "trial") {
    // Dedicated public trial: fetch primary published test
    test = await prisma.test.findFirst({
      where: { isPublished: true },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            questions: {
              orderBy: { questionNo: "asc" },
            },
          },
        },
      },
    });
  } else {
    test = await prisma.test.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            questions: {
              orderBy: { questionNo: "asc" },
            },
          },
        },
      },
    });
  }

  if (!test) {
    notFound();
  }

  // 2. Fetch authenticated candidate session
  const session = await getServerSession(authOptions);

  // 3. STRICT ACCESS GUARD:
  // If test is linked to a course (test.courseId exists) and test is NOT a free trial (!test.isFreeTrial)
  const isFreeTrial = id === "trial" || Boolean((test as any).isFreeTrial);

  if (test.courseId && !isFreeTrial) {
    // If unauthenticated, redirect to login
    if (!session?.user?.id) {
      redirect(`/login?callbackUrl=/test/${id}`);
    }

    const isAdmin = session.user.role === "ADMIN";

    if (!isAdmin) {
      const [enrollment, successOrder] = await Promise.all([
        prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: test.courseId,
            },
          },
        }),
        prisma.order.findFirst({
          where: {
            userId: session.user.id,
            courseId: test.courseId,
            status: OrderStatus.SUCCESS,
          },
        }),
      ]);

      const isEnrolled = Boolean(enrollment || successOrder);
      if (!isEnrolled) {
        const courseSlug = test.course?.slug || test.courseId;
        redirect(`/checkout/${courseSlug}`);
      }
    }
  }

  // Cast prisma test structure to client runner TestData interface
  // SECURITY: Strip correctOption completely from questions sent to the client browser
  const formattedTest: TestData = {
    id: test.id,
    title: test.title,
    slug: test.slug,
    batteryType: test.batteryType,
    totalDurationSeconds: test.totalDurationSeconds,
    passingScore: test.passingScore,
    sections: test.sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      phaseType: sec.phaseType,
      durationSeconds: sec.durationSeconds,
      order: sec.order,
      instructions: sec.instructions,
      studyImageUrl: sec.studyImageUrl,
      questions: sec.questions.map((q) => ({
        id: q.id,
        questionNo: q.questionNo,
        questionImageUrl: q.questionImageUrl,
        optionsJson: q.optionsJson,
        marks: q.marks,
      })),
    })),
  };

  return <RDSOExamRunnerClient test={formattedTest} session={session} />;
}
