import { NextResponse } from 'next/server'

export const GET = async () => {
  // Simple health check endpoint for Render
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  })
}

export const runtime = 'edge' 