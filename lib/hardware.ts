export const ESP32_CONFIG = {
  baseUrl: `http://${process.env.ESP32_IP_ADDRESS}:${process.env.ESP32_API_PORT}`,
  authToken: process.env.ESP32_AUTH_TOKEN,
  endpoints: {
    status: '/status',
    startRegistration: '/start-registration',
    checkRfid: '/check-rfid',
    startFingerprint: '/start-fingerprint',
    checkFingerprint: '/check-fingerprint',
  }
}

export async function makeDeviceRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${ESP32_CONFIG.baseUrl}${endpoint}`
  
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${ESP32_CONFIG.authToken}`)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Device error: ${error}`)
  }

  return response
} 