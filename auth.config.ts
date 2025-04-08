import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await getUserByEmail(email)
        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
          return null
        }

        return user
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/staff") || nextUrl.pathname.startsWith("/student")
      
      if (isOnDashboard) {
        if (isLoggedIn) {
          const userRole = auth.user.role
          if (nextUrl.pathname.startsWith("/staff") && userRole !== "STAFF") {
            return Response.redirect(new URL("/auth/login", nextUrl))
          }
          if (nextUrl.pathname.startsWith("/student") && userRole !== "STUDENT") {
            return Response.redirect(new URL("/auth/login", nextUrl))
          }
          return true
        }
        return false
      }
      return true
    }
  }
} satisfies NextAuthConfig 