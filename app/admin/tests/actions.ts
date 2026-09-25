"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BatteryType, PhaseType } from "@prisma/client";

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

export interface QuestionInput {
  questionNo: number;
  questionImageUrl?: string;
  options: { id: string; label: string; image?: string }[];
  correctOption: string;
  marks?: number;
}

export interface CreateTestPayload {
  title: string;
  slug?: string;
  batteryType: BatteryType;
  courseId?: string | null;
  passingScore?: number;
  isPublished?: boolean;
  
  // Phase Configuration
  hasStudyPhase: boolean;
  studyDurationSeconds?: number;
  studyImageUrl?: string;
  studyInstructions?: string;

  // Question Phase Configuration
  questionDurationSeconds: number;
  questionInstructions?: string;

  // Questions
  questions: QuestionInput[];
}

export async function createRdsoTest(payload: CreateTestPayload) {
  try {
    await ensureAdmin();

    if (!payload.title?.trim()) {
      return { success: false, error: "Test title is required." };
    }

    if (!payload.batteryType) {
      return { success: false, error: "Battery type is required." };
    }

    if (!payload.questions || payload.questions.length === 0) {
      return { success: false, error: "At least one question is required." };
    }

    let finalSlug = payload.slug?.trim() ? slugify(payload.slug) : slugify(payload.title);
    if (!finalSlug) {
      finalSlug = `test-${Date.now()}`;
    }

    // Ensure slug uniqueness
    const existing = await prisma.test.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const studySeconds = payload.hasStudyPhase ? Number(payload.studyDurationSeconds) || 240 : 0;
    const questionSeconds = Number(payload.questionDurationSeconds) || 240;
    const totalDuration = studySeconds + questionSeconds;

    // Transactional Save in Prisma
    const newTest = await prisma.$transaction(async (tx) => {
      // 1. Create Test record
      const test = await tx.test.create({
        data: {
          title: payload.title.trim(),
          slug: finalSlug,
          batteryType: payload.batteryType,
          courseId: payload.courseId && payload.courseId !== "none" ? payload.courseId : null,
          totalDurationSeconds: totalDuration,
          passingScore: Number(payload.passingScore) || 42.0,
          isPublished: Boolean(payload.isPublished),
        },
      });

      let sectionOrder = 1;

      // 2. Create Study Phase (if enabled, e.g. for Memory Tests)
      if (payload.hasStudyPhase) {
        await tx.testSection.create({
          data: {
            testId: test.id,
            title: "Study Phase: Memory Chart",
            phaseType: PhaseType.STUDY_PHASE,
            durationSeconds: studySeconds,
            order: sectionOrder++,
            instructions:
              payload.studyInstructions?.trim() ||
              "Study the locations of all figures on the memory chart carefully. In the next phase, the positions of these figures will be tested.",
            studyImageUrl: payload.studyImageUrl?.trim() || null,
          },
        });
      }

      // 3. Create Question Phase Section
      const questionSection = await tx.testSection.create({
        data: {
          testId: test.id,
          title: payload.hasStudyPhase
            ? "Question Phase: Figure Recall"
            : `${payload.batteryType} Question Test`,
          phaseType: PhaseType.QUESTION_PHASE,
          durationSeconds: questionSeconds,
          order: sectionOrder,
          instructions:
            payload.questionInstructions?.trim() ||
            "Select the correct answer option for each question before the timer runs out.",
        },
      });

      // 4. Create Questions linked to questionSection
      for (let i = 0; i < payload.questions.length; i++) {
        const q = payload.questions[i];
        const formattedOptions = q.options && q.options.length > 0
          ? q.options
          : [
              { id: "A", label: "A" },
              { id: "B", label: "B" },
              { id: "C", label: "C" },
              { id: "D", label: "D" },
              { id: "E", label: "E" },
            ];

        await tx.question.create({
          data: {
            sectionId: questionSection.id,
            questionNo: q.questionNo || i + 1,
            questionImageUrl: q.questionImageUrl?.trim() || null,
            optionsJson: formattedOptions,
            correctOption: q.correctOption || "A",
            marks: Number(q.marks) || 1.0,
            negativeMarks: 0.0,
          },
        });
      }

      return test;
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/tests");
    revalidatePath("/admin/tests/create");

    return { success: true, test: newTest };
  } catch (err: any) {
    console.error("createRdsoTest error:", err);
    return { success: false, error: err.message || "Failed to create RDSO test." };
  }
}

export async function deleteTest(testId: string) {
  try {
    await ensureAdmin();

    await prisma.test.delete({
      where: { id: testId },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/tests");

    return { success: true };
  } catch (err: any) {
    console.error("deleteTest error:", err);
    return { success: false, error: err.message || "Failed to delete test." };
  }
}
