import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAuxiliaryData() {
  console.log("🌱 Seeding rich Study Materials and Video Classes...");

  // Find existing courses
  const course1 = await prisma.course.findFirst({
    where: { slug: "course-1-full-set-video" },
  }) || await prisma.course.findFirst();

  const course2 = await prisma.course.findFirst({
    where: { slug: "course-2-only-video-class" },
  }) || course1;

  const course3 = await prisma.course.findFirst({
    where: { slug: "course-3-speed-test-special-pack" },
  }) || course1;

  if (!course1) {
    console.error("No course found in database.");
    return;
  }

  // Study Materials Data
  const materials = [
    {
      title: "RDSO Official T-Score Formula & Normalization Calculation Guide",
      fileUrl: "/materials/rdso-t-score-formula-guide.pdf",
      fileType: "PDF",
      isFree: true,
      courseId: course1.id,
    },
    {
      title: "Spatial Association & 12-Figure Rapid Recall Mnemonics Sheet",
      fileUrl: "/materials/rdso-memory-shortcuts.pdf",
      fileType: "PDF",
      isFree: true,
      courseId: course1.id,
    },
    {
      title: "RRB ALP & Technician Psycho CBT Previous Year Solved Papers (2018-2024)",
      fileUrl: "/materials/rrb-alp-pyq-papers.pdf",
      fileType: "PDF",
      isFree: false,
      courseId: course1.id,
    },
    {
      title: "RDSO Battery Aptitude Comprehensive Study Notes (Complete Syllabus)",
      fileUrl: "/materials/rdso-battery-notes.pdf",
      fileType: "PDF",
      isFree: false,
      courseId: course1.id,
    },
    {
      title: "Brick Depth Perception 3D Contact Rules & Projection Geometry Workbook",
      fileUrl: "/materials/brick-test-geometry-rules.pdf",
      fileType: "PDF",
      isFree: false,
      courseId: (course3 || course1).id,
    },
    {
      title: "Direction Following (Table & Clock Test) Rapid Navigation Tricks",
      fileUrl: "/materials/clock-direction-tricks.pdf",
      fileType: "PDF",
      isFree: true,
      courseId: course1.id,
    },
    {
      title: "Concentration (Yes/No) Error Reduction Guide & 500 Practice Pairs",
      fileUrl: "/materials/concentration-yes-no-pairs.pdf",
      fileType: "PDF",
      isFree: false,
      courseId: (course3 || course1).id,
    },
    {
      title: "Hexagonal & Perceptual Speed Test Rapid Scanning Method",
      fileUrl: "/materials/perceptual-speed-scanning.pdf",
      fileType: "PDF",
      isFree: true,
      courseId: (course3 || course1).id,
    },
  ];

  for (const m of materials) {
    const existing = await prisma.studyMaterial.findFirst({
      where: { title: m.title },
    });
    if (!existing) {
      await prisma.studyMaterial.create({ data: m });
      console.log("  [+] Created Material:", m.title);
    } else {
      await prisma.studyMaterial.update({
        where: { id: existing.id },
        data: m,
      });
      console.log("  [~] Updated Material:", m.title);
    }
  }

  // Video Classes Data
  const videos = [
    {
      title: "Battery 1: Memory Figures Association & 30-Second Recall Method (24 Mins • Er. Sharma)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: true,
      courseId: (course2 || course1).id,
    },
    {
      title: "Battery 2: Clock Direction & Compass Angle Rapid Solution Tricks (18 Mins • Rajesh Kumar)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: true,
      courseId: (course2 || course1).id,
    },
    {
      title: "Battery 3: 3D Brick Depth Perception & Hidden Block Counting Strategy (32 Mins • Er. Sharma)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: false,
      courseId: (course2 || course1).id,
    },
    {
      title: "Battery 4: Concentration (Yes/No) High-Speed Matching Drills (28 Mins • Dr. A. Verma)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: false,
      courseId: (course2 || course1).id,
    },
    {
      title: "Battery 5: Perceptual Speed & Hexagonal Pattern Recognition Masterclass (22 Mins • Rajesh Kumar)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: false,
      courseId: (course2 || course1).id,
    },
    {
      title: "RDSO Psycho CBT 2026 Strategy: Cutoff Secrets & Sectional Qualifying Rules (35 Mins • Five Education)",
      fileUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
      fileType: "VIDEO",
      isFree: true,
      courseId: (course2 || course1).id,
    },
  ];

  for (const v of videos) {
    const existing = await prisma.studyMaterial.findFirst({
      where: { title: v.title },
    });
    if (!existing) {
      await prisma.studyMaterial.create({ data: v });
      console.log("  [+] Created Video:", v.title);
    } else {
      await prisma.studyMaterial.update({
        where: { id: existing.id },
        data: v,
      });
      console.log("  [~] Updated Video:", v.title);
    }
  }

  console.log("✅ Seeding completed!");
  await prisma.$disconnect();
}

seedAuxiliaryData().catch((e) => {
  console.error(e);
  process.exit(1);
});
