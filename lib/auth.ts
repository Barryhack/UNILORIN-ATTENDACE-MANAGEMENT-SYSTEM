import { getServerSession } from "next-auth"
import { authConfig } from "@/auth.config"
import { getServerSession as getServerSessionAuth } from "next-auth/next"
import { Session } from "next-auth"

export async function getSession() {
  return await getServerSession(authConfig)
}

export async function getCurrentUser() {
  const session = await getSession() as Session | null
  return session?.user
}

// Add the auth function that's needed in route.ts
export async function auth() {
  return await getServerSessionAuth(authConfig)
} 