const API_BASE = "http://localhost:3000/api/v1"

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { accessToken?: string | null } = {}
): Promise<T> {
  const { accessToken, headers, ...rest } = init
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...rest,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Request failed (${res.status})`)
  }
  return data as T
}

export interface InviteArtistPayload {
  email: string
  first_name: string
  last_name: string
}

export interface AcceptInvitationPayload {
  token: string
  password: string
  display_name: string
  bio?: string
  experience_years?: number
  specialty?: string
}

export function inviteNailArtist(payload: InviteArtistPayload, accessToken: string) {
  return apiFetch<{ message: string; email: string; expires_at: string }>(
    "/users/invite-nail-artist",
    { method: "POST", body: JSON.stringify(payload), accessToken }
  )
}

export function acceptInvitation(payload: AcceptInvitationPayload) {
  return apiFetch<{ message: string }>("/users/accept-invitation", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
