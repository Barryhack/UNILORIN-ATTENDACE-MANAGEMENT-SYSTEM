import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function validateCsrfToken(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) {
    throw new Error('Unauthorized')
  }
  return token
} 