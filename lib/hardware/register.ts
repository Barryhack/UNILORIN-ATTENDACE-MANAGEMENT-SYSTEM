import { makeDeviceRequest, ESP32_CONFIG } from "@/lib/hardware"

export async function startHardwareRegistration(userId: string) {
  // Start RFID registration mode
  await makeDeviceRequest(ESP32_CONFIG.endpoints.startRegistration, {
    method: "POST",
    body: JSON.stringify({ userId, mode: "rfid" })
  })
}

export async function checkRFIDStatus(userId: string) {
  const response = await makeDeviceRequest(ESP32_CONFIG.endpoints.checkRfid, {
    method: "POST",
    body: JSON.stringify({ userId })
  })
  return response.json()
}

export async function startFingerprintRegistration(userId: string) {
  await makeDeviceRequest(ESP32_CONFIG.endpoints.startFingerprint, {
    method: "POST",
    body: JSON.stringify({ userId })
  })
}

export async function checkFingerprintStatus(userId: string) {
  const response = await makeDeviceRequest(ESP32_CONFIG.endpoints.checkFingerprint, {
    method: "POST",
    body: JSON.stringify({ userId })
  })
  return response.json()
} 