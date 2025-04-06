import NextAuth, { Session, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string
    } & DefaultSession["user"]
  }
}

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth/error",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

