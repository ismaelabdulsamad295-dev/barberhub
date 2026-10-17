import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Admins are created here, never through the public registration endpoint
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (password at least 12 characters)');
  }

  const admin = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash: await argon2.hash(password),
      fullName: 'Administrator',
      role: 'ADMIN',
    },
  });
  console.log(`Admin created: ${admin.email}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e.message);
  await prisma.$disconnect();
  process.exit(1);
});
