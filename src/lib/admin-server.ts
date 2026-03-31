import { NextRequest } from 'next/server'

export function getAdminSecretFromRequest(request: NextRequest) {
  return (
    request.headers.get('x-admin-secret') ??
    request.cookies.get('admin-secret')?.value ??
    null
  )
}

export function isAdminRequest(request: NextRequest) {
  const expectedSecret = process.env.ADMIN_SECRET

  if (!expectedSecret) {
    return false
  }

  return getAdminSecretFromRequest(request) === expectedSecret
}
