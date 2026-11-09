import * as React from "react"
import { useAuth } from "../context/AuthContext"
import { apiFetch } from "@/lib/api"
import { useState } from "react";

type Salon = { id: string; name: string } | null

let cache: { salon: Salon; checked: boolean } | null = null

export function useMySalon() {
  const { user, accessToken } = useAuth()
  const [salon, setSalon] = useState<Salon>(cache?.salon ?? null)
  const [checkedSalon, setCheckedSalon] = useState(
    cache?.checked ?? false
  )

  React.useEffect(() => {
    if (user?.role !== "salon_manager" || !accessToken) return
    if (cache?.checked) return // already fetched

    let cancelled = false
    apiFetch<{ salon: Salon }>("/salons/my-salon", { accessToken })
      .then((data) => {
        if (cancelled) return
        cache = { salon: data.salon, checked: true }
        setSalon(data.salon)
      })
      .finally(() => {
        if (!cancelled) setCheckedSalon(true)
      })

    return () => {
      cancelled = true
    }
  }, [user, accessToken])

  return { salon, checkedSalon }
}