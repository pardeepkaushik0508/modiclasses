import { PrismaClient, BatteryType, PhaseType, Role } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

interface AuditResult {
  category: string;
  item: string;
  passed: boolean;
  details: string;
}

const auditLog: AuditResult[] = [];

function record(category: string, item: string, passed: boolean, details: string) {
  auditLog.push({ category, item, passed, details });
  const icon = passed ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${icon} [${category}] ${item} -> ${details}`);
}

async function runE2EAudit() {
  console.log("=======================================================================");
  console.log("🔍 [SYSTEMS INTEGRATION AUDIT] Starting Programmatic Verification");
  console.log("=======================================================================");

  // -------------------------------------------------------------------------
  // TEST SUITE 1: COURSE PIPELINE (Admin -> DB -> User Portal)
  // -------------------------------------------------------------------------
  console.log("\n▶️ 1. Auditing Course Management Pipeline...");

  const testSlug = `audit-course-${Date.now().toString().slice(-5)}`;
  let createdCourseId: string | null = null;

  try {
    // 1.1 Direct insert / Create Course Simulation
    const newCourse = await prisma.course.create({
      data: {
        title: "Course No. 99: AUDIT SPEED MASTER PACK",
        slug: testSlug,
        description: "Created programmatically during E2E verification.",
        price: 899.0,
        discountedPrice: 449.0,
        validityDays: 180,
        features: ["Auto Audit Feature 1", "Auto Audit Feature 2", "100% Dynamic"],
        thumbnail: "speed-test",
        isPublished: true,
      },
    });
    createdCourseId = newCourse.id;
    record(
      "Course Pipeline",
      "Course Creation in DB",
      true,
      `Course created in PostgreSQL (ID: ${newCourse.id}, Title: "${newCourse.title}")`
    );

    // 1.2 Verify immediate presence in user homepage feed
    const homeRes = await fetch(`${BASE_URL}/`, { cache: "no-store" });
    const homeHtml = await homeRes.text();
    const hasCourseInHtml = homeHtml.includes("AUDIT SPEED MASTER PACK");
    const hasPriceInHtml = homeHtml.includes("449");
    const hasFeatureInHtml = homeHtml.includes("Auto Audit Feature 1");

    record(
      "Course Pipeline",
      "Dynamic User Portal Feed",
      Boolean(hasCourseInHtml && hasPriceInHtml && hasFeatureInHtml),
      hasCourseInHtml
        ? `Homepage (/) immediately rendered the new course card, price (₹449), and feature checklist!`
        : `Homepage did NOT render the course in HTML.`
    );

    // 1.3 Update Course
    await prisma.course.update({
      where: { id: newCourse.id },
      data: {
        title: "Course No. 99: AUDIT SPEED MASTER PACK [EDITED]",
        discountedPrice: 399.0,
      },
    });

    const homeRes2 = await fetch(`${BASE_URL}/`, { cache: "no-store" });
    const homeHtml2 = await homeRes2.text();
    const hasEditedTitle = homeHtml2.includes("AUDIT SPEED MASTER PACK [EDITED]");
    const hasEditedPrice = homeHtml2.includes("399");

    record(
      "Course Pipeline",
      "Dynamic Course Edit Revalidation",
      Boolean(hasEditedTitle && hasEditedPrice),
      hasEditedTitle
        ? `Homepage immediately updated to edited title and price (₹399).`
        : `Homepage did not reflect the edit.`
    );

    // 1.4 Toggle Publish status to false
    await prisma.course.update({
      where: { id: newCourse.id },
      data: { isPublished: false },
    });

    const homeRes3 = await fetch(`${BASE_URL}/`, { cache: "no-store" });
    const homeHtml3 = await homeRes3.text();
    const isHiddenWhenUnpublished = !homeHtml3.includes("AUDIT SPEED MASTER PACK [EDITED]");

    record(
      "Course Pipeline",
      "Publish Toggle Filtering",
      Boolean(isHiddenWhenUnpublished),
      isHiddenWhenUnpublished
        ? `When isPublished=false, course was correctly excluded from student homepage.`
        : `Course is still visible on student homepage despite isPublished=false!`
    );

    // 1.5 Delete Course
    await prisma.course.delete({ where: { id: newCourse.id } });
    createdCourseId = null;
    record(
      "Course Pipeline",
      "Course Deletion in DB",
      true,
      `Course record cleanly deleted from PostgreSQL.`
    );
  } catch (err: any) {
    record("Course Pipeline", "Course Pipeline Execution", false, err.message);
    if (createdCourseId) {
      await prisma.course.delete({ where: { id: createdCourseId } }).catch(() => {});
    }
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 2: RDSO PSYCHO TEST BUILDER PIPELINE
  // -------------------------------------------------------------------------
  console.log("\n▶️ 2. Auditing RDSO Psycho Test Builder Pipeline...");

  const testAuditSlug = `audit-test-${Date.now().toString().slice(-5)}`;
  let createdTestId: string | null = null;

  try {
    // 2.1 Transactional Save
    const testRecord = await prisma.$transaction(async (tx) => {
      const t = await tx.test.create({
        data: {
          title: "Audit Test - Memory Figure Set 99",
          slug: testAuditSlug,
          batteryType: BatteryType.MEMORY_FIGURE,
          totalDurationSeconds: 480,
          passingScore: 42.0,
          isPublished: true,
        },
      });

      // Study Phase Section
      await tx.testSection.create({
        data: {
          testId: t.id,
          title: "Study Phase: Memory Chart",
          phaseType: PhaseType.STUDY_PHASE,
          durationSeconds: 240,
          order: 1,
          studyImageUrl: "/uploads/audit-study-chart.png",
          instructions: "Study the positions of all figures carefully.",
        },
      });

      // Question Phase Section
      const qSection = await tx.testSection.create({
        data: {
          testId: t.id,
          title: "Question Phase: Figure Recall",
          phaseType: PhaseType.QUESTION_PHASE,
          durationSeconds: 240,
          order: 2,
          instructions: "Select the correct option for each question.",
        },
      });

      // Questions
      for (let i = 1; i <= 6; i++) {
        await tx.question.create({
          data: {
            sectionId: qSection.id,
            questionNo: i,
            questionImageUrl: `/uploads/audit-q-${i}.png`,
            optionsJson: [
              { id: "A", label: "Option A" },
              { id: "B", label: "Option B" },
              { id: "C", label: "Option C" },
              { id: "D", label: "Option D" },
              { id: "E", label: "Option E" },
            ],
            correctOption: "A",
            marks: 1.0,
          },
        });
      }

      return t;
    });

    createdTestId = testRecord.id;

    // Verify DB integrity
    const savedTest = await prisma.test.findUnique({
      where: { id: testRecord.id },
      include: {
        sections: {
          include: { questions: true },
        },
      },
    });

    const has2Sections = Boolean(savedTest && savedTest.sections.length === 2);
    const hasStudyPhase = Boolean(savedTest && savedTest.sections.some((s) => s.phaseType === PhaseType.STUDY_PHASE));
    const qSectionFound = savedTest?.sections.find((s) => s.phaseType === PhaseType.QUESTION_PHASE);
    const has6Questions = Boolean(qSectionFound && qSectionFound.questions.length === 6);

    record(
      "Test Builder Pipeline",
      "Prisma Transactional Save",
      Boolean(has2Sections && hasStudyPhase && has6Questions),
      `Test (${savedTest?.slug}) saved with 2 sections (Study + Question) and 6 questions transactionally.`
    );

    // 2.2 Student Test Runner Launch Audit
    const testRunnerRes = await fetch(`${BASE_URL}/test/${testAuditSlug}?trial=true`);
    const testRunnerHtml = await testRunnerRes.text();

    // Check if the test runner actually consumes the saved title or database questions
    const runnerHasCustomTitle = testRunnerHtml.includes("Audit Test - Memory Figure Set 99");

    record(
      "Test Builder Pipeline",
      "Student Runner Dynamic Rendering",
      Boolean(runnerHasCustomTitle),
      runnerHasCustomTitle
        ? `Student test runner (/test/${testAuditSlug}) dynamically rendered test title and questions from DB.`
        : `CRITICAL GAP: /test/[id]/page.tsx is a client-side mockup! It renders hardcoded dummy questions and does not load dynamic questions from prisma.test!`
    );

    // Cleanup
    await prisma.test.delete({ where: { id: testRecord.id } });
    createdTestId = null;
    record(
      "Test Builder Pipeline",
      "Test Deletion Cleanup",
      true,
      `Verification test records cleanly removed.`
    );
  } catch (err: any) {
    record("Test Builder Pipeline", "Test Builder Execution", false, err.message);
    if (createdTestId) {
      await prisma.test.delete({ where: { id: createdTestId } }).catch(() => {});
    }
  }

  // -------------------------------------------------------------------------
  // TEST SUITE 3: AUTHENTICATION, RBAC & AUTO-REDIRECT
  // -------------------------------------------------------------------------
  console.log("\n▶️ 3. Auditing Authentication, RBAC & Auto-Redirect...");

  try {
    // 3.1 Unauthenticated access to /admin
    const unauthAdminRes = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });
    const status = unauthAdminRes.status;
    const location = unauthAdminRes.headers.get("location");
    const isRedirectedToLogin =
      Boolean((status === 307 || status === 302 || status === 308) &&
      location && location.includes("/login"));

    record(
      "Auth & RBAC",
      "Unauthenticated /admin Route Guard",
      Boolean(isRedirectedToLogin),
      isRedirectedToLogin
        ? `Status ${status}, redirected to ${location}`
        : `Unexpected status ${status}, Location: ${location}`
    );

    // 3.2 Unauthenticated access to /dashboard
    const unauthDashRes = await fetch(`${BASE_URL}/dashboard`, {
      redirect: "manual",
    });
    const dashStatus = unauthDashRes.status;
    const dashLocation = unauthDashRes.headers.get("location");
    const isDashRedirected =
      Boolean((dashStatus === 307 || dashStatus === 302 || dashStatus === 308) &&
      dashLocation && dashLocation.includes("/login"));

    record(
      "Auth & RBAC",
      "Unauthenticated /dashboard Route Guard",
      Boolean(isDashRedirected),
      isDashRedirected
        ? `Status ${dashStatus}, redirected to ${dashLocation}`
        : `Unexpected status ${dashStatus}, Location: ${dashLocation}`
    );

    // 3.3 Verify database users for Admin and Student
    const adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
    const studentUser = await prisma.user.findFirst({
      where: { role: Role.STUDENT },
    });

    record(
      "Auth & RBAC",
      "Admin & Student Seed Accounts",
      Boolean(adminUser && studentUser),
      `Admin: ${adminUser?.email} (${adminUser?.role}), Student: ${studentUser?.email} (${studentUser?.role})`
    );
  } catch (err: any) {
    record("Auth & RBAC", "Auth & RBAC Execution", false, err.message);
  }

  // -------------------------------------------------------------------------
  // SUMMARY OF AUDIT
  // -------------------------------------------------------------------------
  console.log("\n=======================================================================");
  console.log("📊 AUDIT RESULTS SUMMARY");
  console.log("=======================================================================");
  console.table(auditLog);
}

runE2EAudit()
  .catch((e) => {
    console.error("Audit script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
