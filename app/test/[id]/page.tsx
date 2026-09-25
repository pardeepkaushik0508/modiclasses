import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RDSOExamRunnerClient, { TestData } from "./rdso-runner-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RDSOExamRunnerPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Dynamic Database Ingestion from PostgreSQL via Prisma
  let test = await prisma.test.findFirst({
    where: {
      OR: [
        { slug: id },
        { id: id },
      ],
    },
    include: {
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

  // Fallback to primary seeded test if direct ID / demo slug was provided
  if (!test) {
    test = await prisma.test.findFirst({
      where: { isPublished: true },
      include: {
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

  // Cast prisma test structure to client runner TestData interface
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
        correctOption: q.correctOption,
        marks: q.marks,
      })),
    })),
  };

  return <RDSOExamRunnerClient test={formattedTest} session={session} />;
}
