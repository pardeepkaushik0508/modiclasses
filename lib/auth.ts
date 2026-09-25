import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email / Phone & Password",
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "student@example.com or 9876543210",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please provide your email/phone and password.");
        }

        const identifier = credentials.identifier.trim();
        const rawPassword = credentials.password;

        // Find user by either email (case-insensitive) or phone number
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: "insensitive" } },
              { phone: { equals: identifier } },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email or phone number.");
        }

        // Compare password with bcrypt hash
        const isPasswordValid = await bcrypt.compare(rawPassword, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Invalid password. Please try again.");
        }

        // Return user object matching custom User interface
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          rollNo: user.rollNo,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial login, user object is provided from authorize()
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rollNo = user.rollNo;
        token.phone = user.phone;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token fields into session.user
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STUDENT" | "ADMIN";
        session.user.rollNo = token.rollNo as string | null | undefined;
        session.user.phone = token.phone as string | null | undefined;
        session.user.avatarUrl = token.avatarUrl as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
