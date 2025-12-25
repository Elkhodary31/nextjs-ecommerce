import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      phone?: string | null;
    } & DefaultSession["user"];
    token?: string | null;
  }

  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    phone?: string | null;
    token?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    role?: string | null;
    phone?: string | null;
    token?: string | null;
  }
}
