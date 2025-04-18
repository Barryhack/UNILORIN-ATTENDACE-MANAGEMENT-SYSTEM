import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(password, salt)
  console.log('Generated hash:', hash)
  return hash
} 