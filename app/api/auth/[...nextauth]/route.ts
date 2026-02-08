import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * 1. TYPE AUGMENTATION
 * We add 'username' to the Session type definition so TypeScript knows it exists.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      username?: string; // <--- ADDED THIS
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role?: string;
    username?: string;
  }
}

/**
 * 2. AUTH OPTIONS
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * 3. JWT CALLBACK
     * Persist the username from the User object to the Token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username; // <--- ADDED THIS
      }
      return token;
    },
    /**
     * 4. SESSION CALLBACK
     * Pass the username from the Token to the Client Session.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string; // <--- ADDED THIS
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };