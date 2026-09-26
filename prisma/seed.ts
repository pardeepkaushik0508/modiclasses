import { PrismaClient, Role, PhaseType, BatteryType, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("==========================================================");
  console.log("🚀 [Five Education] Starting Database Verification & Seeding");
  console.log("==========================================================");

  // 1. Verify Active PostgreSQL Connection
  console.log("📡 Testing database connectivity...");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ PostgreSQL Database connection is 100% ACTIVE and healthy!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.error("👉 Please ensure your PostgreSQL instance is running and DATABASE_URL in .env is configured.");
    throw error;
  }

  // Pre-compute bcrypt hashes (10 rounds)
  const adminPasswordHash = await bcrypt.hash("AdminPassword123", 10);
  const studentPasswordHash = await bcrypt.hash("StudentPassword123", 10);

  // 2. Upsert Initial Admin User (admin@fiveeducation.com)
  const adminEmail = "admin@fiveeducation.com";
  console.log(`👤 Upserting Admin user: ${adminEmail}`);

  // Find if either admin@fiveeducation.com or previous admin exists
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { email: "admin@fiveeducation.in" },
      ],
    },
  });

  let adminUser;
  if (existingAdmin) {
    adminUser = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: adminEmail,
        name: "Five Education Administrator",
        role: Role.ADMIN,
        passwordHash: adminPasswordHash,
        avatarUrl: "/avatars/admin-avatar.svg",
      },
    });
  } else {
    adminUser = await prisma.user.create({
      data: {
        name: "Five Education Administrator",
        email: adminEmail,
        phone: "+919876543210",
        passwordHash: adminPasswordHash,
        role: Role.ADMIN,
        rollNo: "FE-ADMIN-01",
        avatarUrl: "/avatars/admin-avatar.svg",
      },
    });
  }
  console.log(`✅ Admin user verified with ID: ${adminUser.id} (Role: ${adminUser.role})`);

  // 3. Upsert a Sample Student User
  const studentEmail = "student.demo@fiveeducation.in";
  console.log(`👤 Upserting Sample Student user: ${studentEmail}`);

  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {
      passwordHash: studentPasswordHash,
      avatarUrl: "/avatars/student-avatar.svg",
    },
    create: {
      name: "Rahul Sharma",
      email: studentEmail,
      phone: "+919811223344",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      rollNo: "420101",
      avatarUrl: "/avatars/student-avatar.svg",
    },
  });
  console.log(`✅ Student user verified with ID: ${studentUser.id}`);

  // 4. Create 3 Master Courses with features checklist
  console.log("📚 Upserting 3 Master Courses with Features Checklist...");

  // Course 1
  const course1 = await prisma.course.upsert({
    where: { slug: "course-1-full-set-video" },
    update: {
      title: "Course No. 1: FULL SET + VIDEO",
      price: 999.0,
      discountedPrice: 499.0,
      validityDays: 365,
      isPublished: true,
      features: ["Practice Tests", "Video Classes", "Complete Preparation"],
      thumbnail: "locomotive",
    },
    create: {
      title: "Course No. 1: FULL SET + VIDEO",
      slug: "course-1-full-set-video",
      description: "Complete preparation package including 50+ full simulated RDSO Psycho test sets and in-depth video classes.",
      price: 999.0,
      discountedPrice: 499.0,
      validityDays: 365,
      isPublished: true,
      features: ["Practice Tests", "Video Classes", "Complete Preparation"],
      thumbnail: "locomotive",
      modules: {
        create: [
          { title: "Battery 1: Memory Test Techniques (Figure & Building)", order: 1 },
          { title: "Battery 2: Direction Following (Table & Clock Test)", order: 2 },
          { title: "Battery 3: Depth Perception (Brick & Hidden Blocks)", order: 3 },
          { title: "Battery 4: Concentration (Yes/No & Similar Pairs)", order: 4 },
          { title: "Battery 5: Perceptual Speed (Hexagonal & Similarity)", order: 5 },
        ],
      },
    },
  });
  console.log(`✅ Course 1 verified: ${course1.title}`);

  // Course 2
  const course2 = await prisma.course.upsert({
    where: { slug: "course-2-only-video-class" },
    update: {
      title: "Course No. 2: ONLY VIDEO CLASS",
      price: 599.0,
      discountedPrice: 399.0,
      validityDays: 365,
      isPublished: true,
      features: ["Concept Clarity", "Expert Teaching", "Learn Anytime, Anywhere"],
      thumbnail: "laptop",
    },
    create: {
      title: "Course No. 2: ONLY VIDEO CLASS",
      slug: "course-2-only-video-class",
      description: "Master concept clarity with shortcut tricks and live strategy sessions from RDSO psycho test specialists.",
      price: 599.0,
      discountedPrice: 399.0,
      validityDays: 365,
      isPublished: true,
      features: ["Concept Clarity", "Expert Teaching", "Learn Anytime, Anywhere"],
      thumbnail: "laptop",
    },
  });
  console.log(`✅ Course 2 verified: ${course2.title}`);

  // Course 3
  const course3 = await prisma.course.upsert({
    where: { slug: "course-3-speed-test-special-pack" },
    update: {
      title: "Course No. 3: SPEED TEST SPECIAL PACK",
      price: 399.0,
      discountedPrice: 199.0,
      validityDays: 180,
      isPublished: true,
      features: ["50+ Speed Test Drills", "Hexagonal & Similarity Sets", "Instant T-Score Assessment"],
      thumbnail: "speed-test",
    },
    create: {
      title: "Course No. 3: SPEED TEST SPECIAL PACK",
      slug: "course-3-speed-test-special-pack",
      description: "Dedicated speed testing battery pack for RRB Assistant Loco Pilot and Station Master psycho examination.",
      price: 399.0,
      discountedPrice: 199.0,
      validityDays: 180,
      isPublished: true,
      features: ["50+ Speed Test Drills", "Hexagonal & Similarity Sets", "Instant T-Score Assessment"],
      thumbnail: "speed-test",
    },
  });
  console.log(`✅ Course 3 verified: ${course3.title}`);

  // Upsert Announcements (Latest Updates Feed)
  console.log("📢 Seeding Announcements Feed...");
  const announcementsData = [
    {
      title: "New Test Series Added",
      subtitle: "Check out the latest practice tests.",
      category: "TEST",
      dateText: "12 Apr 2025",
    },
    {
      title: "New Video Classes",
      subtitle: "Watch new lessons in your course.",
      category: "VIDEO",
      dateText: "10 Apr 2025",
    },
    {
      title: "Study Material Updated",
      subtitle: "Download latest notes & PDFs, tests.",
      category: "MATERIAL",
      dateText: "08 Apr 2025",
    },
    {
      title: "Join Our Groups",
      subtitle: "Be a part of our learning community.",
      category: "GROUP",
      dateText: "05 Apr 2025",
    },
  ];

  await prisma.announcement.deleteMany();
  for (const ann of announcementsData) {
    await prisma.announcement.create({ data: ann });
  }
  console.log("✅ 4 Announcements seeded successfully!");

  const course = course1;

  // 5. Create RDSO Memory Test Structure (Battery: MEMORY_FIGURE)
  const testSlug = "rdso-memory-figure-test-01";
  console.log(`🧠 Upserting RDSO Memory Test: ${testSlug}`);

  // Check if test already exists
  const existingTest = await prisma.test.findUnique({
    where: { slug: testSlug },
    include: { sections: { include: { questions: true } } },
  });

  let testId = existingTest?.id;

  if (!existingTest) {
    const test = await prisma.test.create({
      data: {
        courseId: course.id,
        title: "RDSO Memory Test (Memory on Figures) - Mock 01",
        slug: testSlug,
        batteryType: BatteryType.MEMORY_FIGURE,
        totalDurationSeconds: 480, // 8 minutes total (4 min study + 4 min question)
        passingScore: 42.0,        // 42 T-score cutoff per RDSO battery rule
        isPublished: true,
        sections: {
          create: [
            {
              title: "Part A: Study Phase - Memory Map",
              phaseType: PhaseType.STUDY_PHASE,
              durationSeconds: 240, // 4 mins
              order: 1,
              instructions: "Study the locations of all 12 figures on the memory chart carefully. You have exactly 4 minutes. In the next phase, the positions of these figures will be tested.",
              studyImageUrl: "/tests/memory/set-1-study-chart.png",
            },
            {
              title: "Part A: Question Phase - Figure Recall",
              phaseType: PhaseType.QUESTION_PHASE,
              durationSeconds: 240, // 4 mins
              order: 2,
              instructions: "Select the option (A, B, C, D) showing the exact location where each figure appeared during the study phase.",
              questions: {
                create: Array.from({ length: 12 }, (_, i) => ({
                  questionNo: i + 1,
                  questionImageUrl: `/tests/memory/q-${i + 1}-target.png`,
                  optionsJson: [
                    { id: "A", label: "A", image: `/tests/memory/q-${i + 1}-opt-A.png` },
                    { id: "B", label: "B", image: `/tests/memory/q-${i + 1}-opt-B.png` },
                    { id: "C", label: "C", image: `/tests/memory/q-${i + 1}-opt-C.png` },
                    { id: "D", label: "D", image: `/tests/memory/q-${i + 1}-opt-D.png` },
                  ],
                  correctOption: ["A", "B", "C", "D"][i % 4],
                  marks: 1.0,
                  negativeMarks: 0.0,
                })),
              },
            },
          ],
        },
      },
    });
    testId = test.id;
    console.log(`✅ Test structure created with ID: ${test.id} (12 Questions attached)`);
  } else {
    console.log(`✅ Test already exists with ID: ${existingTest.id}`);
  }

  // 6. Create Demo Order for Student
  const existingOrder = await prisma.order.findFirst({
    where: { userId: studentUser.id, courseId: course.id },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: studentUser.id,
        courseId: course.id,
        gatewayOrderId: "order_mock_9823471023",
        amount: 899.00,
        status: OrderStatus.SUCCESS,
      },
    });
    console.log("✅ Demo student enrollment/order created successfully");
  }

  console.log("==========================================================");
  console.log("🎉 Seeding completed successfully!");
  console.log(`   - Users: Admin (${adminUser.email}), Student (${studentUser.email})`);
  console.log(`   - Course: "${course.title}"`);
  console.log(`   - Test: RDSO MEMORY_FIGURE CBT Test (${testSlug})`);
  console.log("==========================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
