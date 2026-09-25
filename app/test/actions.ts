"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttemptStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface CandidateResponseItem {
  questionId: string;
  selectedOption: string | null;
  timeSpentSeconds?: number;
}

export interface SubmitTestAttemptPayload {
  testId: string;
  responses: CandidateResponseItem[];
}

export interface SubmissionResult {
  success: boolean;
  error?: string;
  attemptId?: string;
  testTitle?: string;
  batteryType?: string;
  totalQuestions: number;
  attemptedCount: number;
  unattemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  rawScore: number;
  totalMarks: number;
  percentage: number;
  tScore: number;
  passingScore: number;
  isQualified: boolean;
  questionReviews: {
    questionNo: number;
    questionId: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
  }[];
}

export async function submitTestAttemptAction(
  payload: SubmitTestAttemptPayload
): Promise<SubmissionResult> {
  try {
    const { testId, responses } = payload;

    if (!testId) {
      return {
        success: false,
        error: "Test ID is required.",
        totalQuestions: 0,
        attemptedCount: 0,
        unattemptedCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        rawScore: 0,
        totalMarks: 0,
        percentage: 0,
        tScore: 0,
        passingScore: 42.0,
        isQualified: false,
        questionReviews: [],
      };
    }

    // 1. Fetch test details and all questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        sections: {
          include: {
            questions: {
              orderBy: { questionNo: "asc" },
            },
          },
        },
      },
    });

    if (!test) {
      return {
        success: false,
        error: "Test not found in database.",
        totalQuestions: 0,
        attemptedCount: 0,
        unattemptedCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        rawScore: 0,
        totalMarks: 0,
        percentage: 0,
        tScore: 0,
        passingScore: 42.0,
        isQualified: false,
        questionReviews: [],
      };
    }

    // Collect all questions across sections
    const allQuestions = test.sections.flatMap((s) => s.questions);
    const totalQuestions = allQuestions.length;
    const totalMarks = allQuestions.reduce((sum, q) => sum + (q.marks || 1.0), 0);

    // Map client responses by questionId
    const responseMap = new Map<string, CandidateResponseItem>();
    for (const r of responses) {
      responseMap.set(r.questionId, r);
    }

    // 2. Score candidate responses
    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = 0;
    let rawScore = 0;

    const questionReviews: SubmissionResult["questionReviews"] = [];

    const scoredResponses: {
      questionId: string;
      selectedOption: string | null;
      isCorrect: boolean;
      timeSpentSeconds: number;
    }[] = [];

    for (const q of allQuestions) {
      const resp = responseMap.get(q.id);
      const selected = resp?.selectedOption?.trim().toUpperCase() || null;
      const isAttempted = selected !== null && selected !== "";

      const isCorrect = isAttempted && selected === q.correctOption.trim().toUpperCase();

      if (isAttempted) {
        attemptedCount++;
        if (isCorrect) {
          correctCount++;
          rawScore += q.marks || 1.0;
        } else {
          incorrectCount++;
        }
      }

      scoredResponses.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect: isAttempted ? isCorrect : false,
        timeSpentSeconds: resp?.timeSpentSeconds || 0,
      });

      questionReviews.push({
        questionNo: q.questionNo,
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correctOption,
        isCorrect,
      });
    }

    const unattemptedCount = totalQuestions - attemptedCount;
    const percentage = totalMarks > 0 ? Math.round((rawScore / totalMarks) * 1000) / 10 : 0;

    // 3. Compute Official RDSO T-Score Formula
    // T = 50 + 10 * ((RawScore - Mean) / SD)
    // RDSO baseline benchmark parameters:
    // Mean = TotalQuestions * 0.55, SD = TotalQuestions * 0.18
    const mean = totalQuestions * 0.55;
    const sd = Math.max(1.0, totalQuestions * 0.18);
    const rawTScore = 50 + 10 * ((rawScore - mean) / sd);
    // Round to 1 decimal place per RDSO CBT report card format
    const tScore = Math.max(20.0, Math.min(80.0, Math.round(rawTScore * 10) / 10));
    const passingScore = test.passingScore || 42.0;
    const isQualified = tScore >= passingScore;

    // 4. Resolve Candidate Identity
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {
      // Outside of active Next.js request context (e.g. testing / scripts)
    }
    let candidateUserId: string | null = session?.user?.id || null;

    if (!candidateUserId) {
      // If guest trial, associate with default student demo account
      const defaultStudent = await prisma.user.findFirst({
        where: { role: Role.STUDENT },
      });
      if (defaultStudent) {
        candidateUserId = defaultStudent.id;
      } else {
        // Fallback to any user
        const anyUser = await prisma.user.findFirst();
        candidateUserId = anyUser?.id || null;
      }
    }

    // 5. Transactionally persist TestAttempt and UserResponse records
    let attemptId = `mock-${Date.now()}`;
    if (candidateUserId) {
      const attempt = await prisma.$transaction(async (tx) => {
        const att = await tx.testAttempt.create({
          data: {
            userId: candidateUserId!,
            testId: test.id,
            status: AttemptStatus.COMPLETED,
            rawScore,
            tScore,
            completedAt: new Date(),
          },
        });

        // Insert user responses
        for (const item of scoredResponses) {
          await tx.userResponse.create({
            data: {
              attemptId: att.id,
              questionId: item.questionId,
              selectedOption: item.selectedOption,
              isCorrect: item.isCorrect,
              timeSpentSeconds: item.timeSpentSeconds,
            },
          });
        }

        return att;
      });

      attemptId = attempt.id;
    }

    // Revalidate paths for live dashboard statistics
    try {
      revalidatePath("/");
      revalidatePath("/dashboard");
      revalidatePath("/admin");
    } catch {
      // Outside of active Next.js request context
    }

    return {
      success: true,
      attemptId,
      testTitle: test.title,
      batteryType: test.batteryType,
      totalQuestions,
      attemptedCount,
      unattemptedCount,
      correctCount,
      incorrectCount,
      rawScore,
      totalMarks,
      percentage,
      tScore,
      passingScore,
      isQualified,
      questionReviews,
    };
  } catch (err: any) {
    console.error("submitTestAttemptAction error:", err);
    return {
      success: false,
      error: err.message || "Failed to submit test attempt.",
      totalQuestions: 0,
      attemptedCount: 0,
      unattemptedCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      rawScore: 0,
      totalMarks: 0,
      percentage: 0,
      tScore: 0,
      passingScore: 42.0,
      isQualified: false,
      questionReviews: [],
    };
  }
}
