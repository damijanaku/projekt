const API_BASE = "http://localhost:3000/api/v1"

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { accessToken?: string | null } = {}
): Promise<T> {
  const { accessToken, headers, ...rest } = init
  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...rest,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = (data as { message?: string }).message ?? `Request failed (${res.status})`
    if (res.status === 403 && /token has expired/i.test(message) && typeof window !== "undefined") {
      window.dispatchEvent(new Event("nailbabe:session-expired"))
    }
    throw new Error(message)
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

export interface SalonCategory {
  id: number
  name: string
}

export interface SalonSummary {
  id: string
  name: string
  image_url: string
  category_name: string
  region: string
}

export interface CreateSalonPayload {
  name: string
  description: string
  category_id: number
  region: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  instagram: string
  image?: File
}

export function getMySalon(accessToken: string) {
  return apiFetch<{ salon: SalonSummary | null }>("/salons/my-salon", {
    accessToken,
  })
}

export function getSalonCategories() {
  return apiFetch<{ categories: SalonCategory[] }>("/salons/categories")
}

export function createSalon(payload: CreateSalonPayload, accessToken: string) {
  const { image, ...salonFields } = payload
  const formData = new FormData()
  Object.entries(salonFields).forEach(([key, value]) => {
    formData.append(key, String(value))
  })
  if (image) formData.append("image", image)

  return apiFetch<{ message: string; salon: SalonSummary }>("/salons/create-salon", {
    method: "POST",
    body: formData,
    accessToken,
  })
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
