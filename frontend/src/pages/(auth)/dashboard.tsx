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
import { apiFetch, getMySalon, type SalonCategory, type SalonRegion, type SalonSummary } from "../../lib/api"

const API_BASE = import.meta.env.VITE_IMAGE_UPLOAD_URL || "http://localhost:3000"

let allSalonsCache: SalonSummary[] | null = null
let allSalonsPromise: Promise<SalonSummary[]> | null = null

async function fetchAllSalons(accessToken: string): Promise<SalonSummary[]> {
  if (allSalonsCache) return allSalonsCache
  if (allSalonsPromise) return allSalonsPromise

  allSalonsPromise = apiFetch<{ salons: SalonSummary[] }>("/salons/all", {
    method: "GET",
    accessToken,
  })
    .then((data) => {
      allSalonsCache = data.salons
      return data.salons
    })
    .finally(() => {
      allSalonsPromise = null 
    })

  return allSalonsPromise
}

function resolveImageUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith("data:")) return url
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`
}

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
  const [regions, setRegions] = React.useState<SalonRegion[]>([])
  const [regionError, setRegionError] = React.useState<string | null>(null)

  // all-salons state
  const [allSalons, setAllSalons] = React.useState<SalonSummary[]>(() => allSalonsCache ?? [])
  const [allSalonsLoading, setAllSalonsLoading] = React.useState(false)
  const [allSalonsError, setAllSalonsError] = React.useState<string | null>(null)

  // manager: own salon
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

  // customer: regions
  React.useEffect(() => {
    if (!accessToken || user?.role !== "customer") return

    let cancelled = false
    apiFetch<{ regions: SalonRegion[] }>("/salons/regions", {
      method: "GET",
      accessToken,
    })
      .then(({ regions }) => {
        if (!cancelled) setRegions(regions)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRegionError(error instanceof Error ? error.message : "Could not load regions")
        }
      })

    return () => {
      cancelled = true
    }
  }, [user?.role, accessToken])

  // customer: categories
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

  // is any search actually active?
  const hasActiveSearch =
    hasSearched ||
    searchParams.name.trim() !== "" ||
    searchParams.category.trim() !== "" ||
    searchParams.region.trim() !== ""

  React.useEffect(() => {
    if (user?.role !== "customer" || !accessToken) return
    if (hasActiveSearch) return
    if (allSalonsCache) {
      if (allSalons.length !== allSalonsCache.length) setAllSalons(allSalonsCache)
      return
    }

    let cancelled = false
    setAllSalonsLoading(true)
    setAllSalonsError(null)

    fetchAllSalons(accessToken)
      .then((salons) => {
        if (!cancelled) setAllSalons(salons)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAllSalonsError(error instanceof Error ? error.message : "Could not load salons")
        }
      })
      .finally(() => {
        if (!cancelled) setAllSalonsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user?.role, accessToken, hasActiveSearch])

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

  // list to shows
  const displaySalons = hasSearched && !searchError ? salonResults : allSalons

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

          {user?.role === "customer" && (
            <div className="flex h-full flex-col items-start gap-4 text-center text-muted-foreground">
              <h2 className="font-semibold text-lg text-black">Poiščite svoj salon</h2>

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
                  <select
                    value={searchParams.region}
                    onChange={(e) => setSearchParams({ ...searchParams, region: e.target.value })}
                    className="h-10 w-48 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option  value="">Vse regije</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </label>

                <Button onClick={searchSalonUrl} className="bg-white px-12 py-4 text-sm text-black hover:bg-[#EBAFE2]/40">
                  {isSearching ? "Iščem…" : "Išči"}
                </Button>
              </div>

              {categoryError && <p role="alert" className="text-sm text-destructive">{categoryError}</p>}
              {regionError && <p role="alert" className="text-sm text-destructive">{regionError}</p>}
              {searchError && <p role="alert" className="text-sm text-destructive">{searchError}</p>}
              {allSalonsError && <p role="alert" className="text-sm text-destructive">{allSalonsError}</p>}

              {!hasActiveSearch && allSalonsLoading && (
                <p className="text-sm text-muted-foreground">Nalagam salone…</p>
              )}

              {!isSearching && hasSearched && !searchError && salonResults.length === 0 && (
                <p className="text-sm text-muted-foreground">Ni najdenih salonov.</p>
              )}

              {displaySalons.length > 0 && (
                <ul className="w-full space-y-2 p-4">
                  {displaySalons.map((result) => {
                    const imageUrl = resolveImageUrl(result.image_url)
                    return (
                      <li
                        key={result.id}
                        className="flex flex-row justify-start items-center gap-4 rounded-sm border bg-card p-4 hover:bg-[#EBAFE2]/40"
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={result.name}
                            className="h-28 w-44 rounded-lg object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                          />
                        )}
                        <div className="flex flex-col gap-2 text-left">
                          <strong className="text-lg font-bold">{result.name}</strong>
                          <span className="text-sm text-muted-foreground">{result.category_name}</span>
                        </div>
                        <div className="ml-auto flex flex-col gap-2 items-end">
                          <Button
                            className="bg-[#EBAFE2] hover:bg-[#EBAFE2]/90 rounded-sm px-4 py-2 text-base h-10"
                            render={<Link to={`/salon/${result.id}`} />}
                          >
                            Ogled profila
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
