import bcrypt from 'bcryptjs'
import { hashPassword } from '../lib/password-util'

async function main() {
  const password = 'admin123'
  const hash = await hashPassword(password)
  console.log('Password:', password)
  console.log('Hash:', hash)
  
  // Verify the hash
  const isValid = await bcrypt.compare(password, hash)
  console.log('Hash verification:', isValid)
}

main().catch(console.error) 