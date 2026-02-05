import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * 1. TYPE AUGMENTATION
 * This tells TypeScript that our 'user' and 'session' objects 
 * officially include 'id' and 'role'.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
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

        // Find user in Supabase via Prisma
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        // Check password hash
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        // IMPORTANT: Return the id and role here so callbacks can see them
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
     * Runs when the token is created. We save the id/role into the token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    /**
     * 4. SESSION CALLBACK
     * Runs whenever the session is checked. We pass the id/role to the browser.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JWT for speed and stateless auth
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Points to your custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };