import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "@/lib/constants/api";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${BASE_URL}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }

        // Return user object with token
        return {
          id: data.user?.email,
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role,
          token: data.token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      return { ...session, ...token, ...user };
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
