import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
  }
}

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your credentials")
        }

        try {
          // Find user by email, staffId, or matricNo
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { staffId: credentials.email },
                { matricNo: credentials.email }
              ]
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              staffId: true,
              matricNo: true
            }
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!passwordMatch) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            role: user.role.toUpperCase()
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
} satisfies NextAuthConfig

export const { auth, signIn, signOut } = NextAuth(authConfig) 