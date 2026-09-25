import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "ADMIN";
      rollNo?: string | null;
      phone?: string | null;
      avatarUrl?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "STUDENT" | "ADMIN";
    rollNo?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "STUDENT" | "ADMIN";
    rollNo?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  }
}
