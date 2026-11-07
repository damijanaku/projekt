import * as React from "react"
import { apiFetch } from "@/lib/api"

export interface AuthUser {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface RegisterPayload {
  email: string
  password: string
  role: "customer" | "salon_manager"
  first_name: string
  last_name: string
  display_name?: string
  default_region?: string
  notes?: string
}

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  register: (payload: RegisterPayload) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<{
          user: AuthUser
          accessToken: string
        }>("/users/refresh", { method: "GET" })
        if (!cancelled) {
          setUser(data.user)
          setAccessToken(data.accessToken)
        }
      } catch {
        // no valid refresh token — stay logged out
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const register = React.useCallback(async (payload: RegisterPayload) => {
    await apiFetch("/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }, [])

  const login = React.useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; accessToken: string }>(
      "/users/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    )
    setUser(data.user)
    setAccessToken(data.accessToken)
  }, [])

  const logout = React.useCallback(async () => {
    try {
      await apiFetch("/users/logout", { method: "POST" })
    } catch {
      // ignore
    } finally {
      setUser(null)
      setAccessToken(null)
    }
  }, [])

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}