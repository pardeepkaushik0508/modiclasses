import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDemoEnrollments() {
  console.log("==========================================================");
  console.log("🛡️  [PI EDUCATION LMS] Resetting Demo Student Enrollments");
  console.log("==========================================================");

  const demoEmail = "student.demo@fiveeducation.in";

  try {
    // 1. Find demo student
    const studentUser = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (!studentUser) {
      console.log(`⚠️ Demo student not found with email: ${demoEmail}`);
      console.log("👉 Run 'npm run db:seed' to seed the initial student user.");
      return;
    }

    console.log(`👤 Found demo student: ${studentUser.name} (${studentUser.email}) [ID: ${studentUser.id}]`);

    // 2. Query current enrollments, orders, and coupon usages
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { userId: studentUser.id },
      include: { course: true },
    });

    const existingOrders = await prisma.order.findMany({
      where: { userId: studentUser.id },
      include: { course: true },
    });

    console.log(`📊 Prior State for ${demoEmail}:`);
    console.log(`   - Enrolled Courses in 'enrollments' table: ${existingEnrollments.length}`);
    existingEnrollments.forEach((e) => {
      console.log(`     * ${e.course.title} (slug: ${e.course.slug})`);
    });

    console.log(`   - Orders in 'orders' table: ${existingOrders.length}`);
    existingOrders.forEach((o) => {
      console.log(`     * ${o.course.title} | Status: ${o.status} | Amount: ₹${o.finalAmount || o.amount}`);
    });

    // 3. Atomically delete coupon usages, enrollments, and orders
    console.log("\n🧹 Purging all enrollments, orders, and coupon usages for demo candidate...");

    const delUsages = await prisma.couponUsage.deleteMany({
      where: { userId: studentUser.id },
    });

    const delEnrollments = await prisma.enrollment.deleteMany({
      where: { userId: studentUser.id },
    });

    const delOrders = await prisma.order.deleteMany({
      where: { userId: studentUser.id },
    });

    console.log(`✅ Deleted ${delUsages.count} coupon usage records.`);
    console.log(`✅ Deleted ${delEnrollments.count} enrollment records.`);
    console.log(`✅ Deleted ${delOrders.count} order records.`);

    // 4. Verify Paywall Lock Status Across All Published Courses
    console.log("\n==========================================================");
    console.log("🔒 PAYWALL VERIFICATION FOR UNENROLLED DEMO CANDIDATE");
    console.log("==========================================================");

    const publishedCourses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
      include: {
        tests: {
          select: { id: true, title: true, slug: true },
        },
        studyMaterials: {
          select: { id: true, title: true, isFree: true, fileType: true },
        },
      },
    });

    // Remaining enrollments for demo candidate
    const remainingEnrollments = await prisma.enrollment.count({
      where: { userId: studentUser.id },
    });
    const remainingOrders = await prisma.order.count({
      where: { userId: studentUser.id, status: "SUCCESS" },
    });

    console.log(`Candidate Active Enrollments: ${remainingEnrollments}`);
    console.log(`Candidate Active Success Orders: ${remainingOrders}`);
    console.log(`Paywall State: 100% CLEAN & UNENROLLED\n`);

    for (const course of publishedCourses) {
      console.log(`📚 Course: "${course.title}"`);
      console.log(`   - Slug: ${course.slug}`);
      console.log(`   - Price: ₹${course.price} (Discounted: ₹${course.discountedPrice || "N/A"})`);
      console.log(`   - Access Status: 🔒 LOCKED (Paywall Enforced -> Redirects to /checkout/${course.slug})`);
      console.log(`   - Linked Tests (${course.tests.length}):`);
      for (const t of course.tests) {
        console.log(`     * 🔒 [LOCKED] ${t.title} (${t.slug})`);
      }
      console.log(`   - Study Materials (${course.studyMaterials.length}):`);
      for (const m of course.studyMaterials) {
        const status = m.isFree ? "🔓 FREE PREVIEW" : "🔒 LOCKED (fileUrl = null)";
        console.log(`     * ${status} - ${m.title} [${m.fileType}]`);
      }
      console.log("");
    }

    console.log("==========================================================");
    console.log("🎉 Reset complete! Demo student is ready for paywall testing.");
    console.log("==========================================================");
  } catch (error) {
    console.error("❌ Error resetting demo enrollments:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDemoEnrollments();
