import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("==========================================================");
  console.log("🛡️  [Five Education] Initial Admin User Setup");
  console.log("==========================================================");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@fiveeducation.com").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123";
  const adminPhone = process.env.ADMIN_PHONE || "+919876543210";
  const adminName = "Five Education Administrator";

  console.log(`👤 Target Admin Email: ${adminEmail}`);
  console.log("🔐 Hashing password with bcrypt (10 rounds)...");
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Check if an admin with this email or phone or previous admin@fiveeducation.in exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: adminEmail },
        { email: "admin@fiveeducation.in" },
        { phone: adminPhone },
      ],
    },
  });

  let adminUser;
  if (existingUser) {
    console.log(`🔄 Updating existing user record (ID: ${existingUser.id}) to target admin...`);
    adminUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        passwordHash,
        role: Role.ADMIN,
        rollNo: existingUser.rollNo || "FE-ADMIN-01",
      },
    });
  } else {
    console.log("✨ Creating new Admin user...");
    adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        passwordHash,
        role: Role.ADMIN,
        rollNo: "FE-ADMIN-01",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      },
    });
  }

  console.log("✅ Admin user setup successful!");
  console.log(`   - ID: ${adminUser.id}`);
  console.log(`   - Name: ${adminUser.name}`);
  console.log(`   - Email: ${adminUser.email}`);
  console.log(`   - Phone: ${adminUser.phone}`);
  console.log(`   - Role: ${adminUser.role}`);
  console.log(`   - Roll No: ${adminUser.rollNo}`);
  console.log(`   - Credentials:`);
  console.log(`       Email: ${adminEmail}`);
  console.log(`       Password: ${adminPassword}`);
  console.log("==========================================================");
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
