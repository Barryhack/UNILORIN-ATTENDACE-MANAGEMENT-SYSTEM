import crypto from 'crypto'

// Generate a secure random string for NEXTAUTH_SECRET
export function generateSecret() {
  return crypto.randomBytes(32).toString('hex')
} 