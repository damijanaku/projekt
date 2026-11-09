import * as React from "react"
import { Link } from "react-router"
import { AppSidebar } from "../../components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { apiFetch, getMySalon, type SalonCategory, type SalonSummary } from "../../lib/api"

export default function Dashboard() {
  const { user, accessToken } = useAuth()
  const [salon, setSalon] = React.useState<SalonSummary | null>(null)
  const [salonChecked, setSalonChecked] = React.useState(false)
  const [salonError, setSalonError] = React.useState<string | null>(null)
  const [searchParams, setSearchParams] = React.useState({
    name: "",
    category: "",
    region: "",
  })
  const [salonResults, setSalonResults] = React.useState<SalonSummary[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const [searchError, setSearchError] = React.useState<string | null>(null)
  const [categories, setCategories] = React.useState<SalonCategory[]>([])
  const [categoryError, setCategoryError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (user?.role !== "salon_manager" || !accessToken) {
      setSalonChecked(true)
      return
    }

    let cancelled = false
    getMySalon(accessToken)
      .then(({ salon }) => {
        if (!cancelled) setSalon(salon)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setSalonError(error instanceof Error ? error.message : "Could not check your salon")
        }
      })
      .finally(() => {
        if (!cancelled) setSalonChecked(true)
      })

    return () => {
      cancelled = true
    }
  }, [user?.role, accessToken])

  React.useEffect(() => {
    if (!accessToken || user?.role !== "customer") return

    let cancelled = false
    apiFetch<{ categories: SalonCategory[] }>("/salons/get-categories", {
      method: "GET",
      accessToken,
    })
      .then(({ categories }) => {
        if (!cancelled) setCategories(categories)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setCategoryError(error instanceof Error ? error.message : "Could not load categories")
        }
      })

    return () => {
      cancelled = true
    }
  }, [user?.role, accessToken])

  const searchSalonUrl = async () => {
    if (!accessToken) return

    const query = new URLSearchParams()
    if (searchParams.name.trim()) query.set("name", searchParams.name.trim())
    if (searchParams.category.trim()) query.set("category", searchParams.category.trim())
    if (searchParams.region.trim()) query.set("region", searchParams.region.trim())

    if (query.size === 0) {
      setSalonResults([])
      setHasSearched(false)
      setSearchError("Vnesite vsaj en iskalni podatek.")
      return
    }

    try {
      setIsSearching(true)
      setSearchError(null)
      const data = await apiFetch<{ salons: SalonSummary[] }>(`/salons/find-salon?${query.toString()}`, {
        method: "GET",
        accessToken,
      })
      setSalonResults(data.salons)
      setHasSearched(true)
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Could not search salons")
    } finally {
      setIsSearching(false)
    }
  }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">NailBabe</h1>
        </header>
        <div className="space-y-4 p-6">
          {user?.role === "salon_manager" && !salonChecked && (
            <p className="text-sm text-muted-foreground">Checking your salon…</p>
          )}
          {user?.role === "salon_manager" && salonError && (
            <p role="alert" className="text-sm text-destructive">{salonError}</p>
          )}
          {user?.role === "salon_manager" && salonChecked && !salonError && salon && (
            <p>Your salon is <strong>{salon.name}</strong>.</p>
          )}
          {user?.role === "salon_manager" && salonChecked && !salonError && !salon && (
            <Button className="bg-[#EBAFE2] hover:bg-[#EBAFE2]/90" render={<Link to="/dashboard/create-salon" />}>
              Create your salon
            </Button>
          )}
        </div>

        {user?.role === "customer" && (
          <div className="flex h-full flex-col mx-4 items-start gap-4 text-center text-muted-foreground">
            <text className="font-semibold text-lg text-black">
              Poiščite svoj salon
            </text>

            <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-lg bg-[#EBAFE2]/40 p-4">
              <label className="flex shrink-0 items-center gap-4 text-sm text-black">
                <span className="whitespace-nowrap">Naziv salona:</span>
                <input
                  value={searchParams.name}
                  onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                  className="h-10 w-40 rounded-lg border border-input bg-background px-3 text-sm"
                  placeholder="Vnesite naziv"
                />
              </label>
              <label className="flex shrink-0 items-center gap-4 text-sm text-black">
                <span className="whitespace-nowrap">Kategorija salona</span>
                <select
                  value={searchParams.category}
                  onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                  className="h-10 w-48 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Vse kategorije</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex shrink-0 items-center gap-4 text-sm text-black">
                <span className="whitespace-nowrap">Regija salona:</span>
                <input
                  value={searchParams.region}
                  onChange={(e) => setSearchParams({ ...searchParams, region: e.target.value })}
                  className="h-10 w-40 rounded-lg border border-input bg-background px-3 text-sm"
                  placeholder="Vnesite regijo"
                />
              </label>

              <Button onClick={searchSalonUrl} className="bg-white px-12 py-4 text-sm text-black hover:bg-[#EBAFE2]/40">
                {isSearching ? "Iščem…" : "Išči"}
              </Button>
            </div>
            {categoryError && <p role="alert" className="text-sm text-destructive">{categoryError}</p>}
            {searchError && <p role="alert" className="text-sm text-destructive">{searchError}</p>}
            {!isSearching && hasSearched && !searchError && salonResults.length === 0 && (
              <p className="text-sm text-muted-foreground">Ni najdenih salonov.</p>
            )}
            {salonResults.length > 0 && (
              <ul className="w-full space-y-2">
                {salonResults.map((result) => (
                  <li key={result.id} className="rounded-lg border bg-card p-4">
                    <strong>{result.name}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>


        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
