import * as React from "react"
import { Link, useNavigate } from "react-router"
import { ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import { IoClose } from "react-icons/io5";

import {
  getMySalon,
  getSalonGallery,
  getSalonCategories,
  getSalonRegions,
  getUploadUrl,
  updateSalon,
  uploadSalonGallery,
  deleteSalonGalleryImage,
  type SalonCategory,
  type SalonRegion,
  type SalonSummary,
  type SalonGalleryImage,
} from "../../lib/api"
import { useEffect, useRef, useState } from "react"


export default function EditSalon() {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()
  const [salon, setSalon] = useState<SalonSummary | null>(null)
  const [categories, setCategories] = useState<SalonCategory[]>([])
  const [regions, setRegions] = useState<SalonRegion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [gallery, setGallery] = useState<SalonGalleryImage[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([])
  const [isGalleryPending, setIsGalleryPending] = useState(false)
  const [deletingGalleryImageId, setDeletingGalleryImageId] = useState<string | null>(null)



  useEffect(() => {
    if (!accessToken || user?.role !== "salon_manager") {
      navigate("/dashboard", { replace: true })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const [salonData, categoryData, regionData] = await Promise.all([
          getMySalon(accessToken),
          getSalonCategories(),
          getSalonRegions(),
        ])
        if (cancelled) return
        if (!salonData.salon) {
          navigate("/dashboard/create-salon", { replace: true })
          return
        }
        setSalon(salonData.salon)
        setCategories(categoryData.categories)
        setRegions(regionData.regions)
        const galleryData = await getSalonGallery(salonData.salon.id, accessToken)
        if (!cancelled) setGallery(galleryData.images)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load salon details")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [accessToken, navigate, user?.role])

  // Build a preview URL: prefer the newly selected file, fall back to the existing image.
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(salon?.image_url ? getUploadUrl(salon.image_url) : null)
  }, [file, salon?.image_url])

  useEffect(() => {
    const urls = galleryFiles.map((image) => URL.createObjectURL(image))
    setGalleryPreviewUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [galleryFiles])

  async function handleGalleryUpload() {
    if (!accessToken || !salon || galleryFiles.length === 0) return
    try {
      setIsGalleryPending(true)
      setError(null)
      const result = await uploadSalonGallery(salon.id, galleryFiles, accessToken)
      setGallery((current) => [...current, ...result.images])
      setGalleryFiles([])
      if (galleryInputRef.current) galleryInputRef.current.value = ""
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload gallery images")
    } finally {
      setIsGalleryPending(false)
    }
  }

  async function handleGalleryDelete(imageId: string) {
    if (!accessToken || !salon) return
    try {
      setDeletingGalleryImageId(imageId)
      setError(null)
      await deleteSalonGalleryImage(salon.id, imageId, accessToken)
      setGallery((current) => current.filter((image) => image.id !== imageId))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not remove gallery image")
    } finally {
      setDeletingGalleryImageId(null)
    }
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!accessToken || !salon) {
      setError("Please log in again to update your salon")
      return
    }

    const form = new FormData(event.currentTarget)
    try {
      setIsPending(true)
      await updateSalon(salon.id, {
        name: String(form.get("name") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        category_id: Number(form.get("category_id")),
        region_id: Number(form.get("region_id")),
        address: String(form.get("address") ?? "").trim(),
        city: String(form.get("city") ?? "").trim(),
        postal_code: String(form.get("postal_code") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        instagram: String(form.get("instagram") ?? "").trim(),
        image: file ?? undefined,
      }, accessToken)
      navigate("/dashboard", { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not update salon")
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) return <main className="mx-auto w-full max-w-2xl px-4 py-10">Loading salon details…</main>
  if (!salon) {
    return <main className="mx-auto w-full max-w-2xl px-4 py-10">{error ?? "Salon not found."}</main>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto mb-8 w-full max-w-5xl space-y-2">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">Back to dashboard</Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit salon</h1>
        <p className="text-sm text-muted-foreground">Update your salon details and profile photo.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Salon name</FieldLabel>
              <Input id="name" name="name" required maxLength={150} defaultValue={salon.name} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea id="description" name="description" required rows={4} defaultValue={salon.description ?? ""}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </Field>
            <Field>
              <FieldLabel htmlFor="category_id">Category</FieldLabel>
              <div className="relative">
                <select id="category_id" name="category_id" required defaultValue={salon.category_id}
                  className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-8 text-sm">
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="region_id">Region</FieldLabel>
                <select id="region_id" name="region_id" required defaultValue={salon.region_id}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" name="city" required maxLength={100} defaultValue={salon.city ?? ""} />
              </Field>
            </div>
            <Field><FieldLabel htmlFor="address">Street address</FieldLabel><Input id="address" name="address" required maxLength={255} defaultValue={salon.address ?? ""} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field><FieldLabel htmlFor="postal_code">Postal code</FieldLabel><Input id="postal_code" name="postal_code" required maxLength={20} defaultValue={salon.postal_code ?? ""} /></Field>
              <Field><FieldLabel htmlFor="phone">Phone</FieldLabel><Input id="phone" name="phone" type="tel" required maxLength={30} defaultValue={salon.phone ?? ""} /></Field>
            </div>
            <Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" name="email" type="email" required maxLength={255} defaultValue={salon.email ?? ""} /></Field>
            <Field><FieldLabel htmlFor="instagram">Instagram</FieldLabel><Input id="instagram" name="instagram" required maxLength={255} defaultValue={salon.instagram ?? ""} placeholder="@your-salon" /></Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Salon profile photo</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg p-8 text-center transition-colors ${
                previewUrl ? "border-2 border-transparent hover:border-[#EF9A9A]" : "border-2 border-dashed border-gray-300 hover:border-[#EF9A9A]"
              }`}
              style={
                previewUrl
                  ? {
                      backgroundImage: `url(${previewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : undefined
              }
            >
              {/* Overlay keeps the label on top */}
              <div
                className={`flex flex-col items-center justify-center ${
                  previewUrl ? "rounded-md bg-black/50 px-4 py-3 text-white" : ""
                }`}
              >
                {!previewUrl && <span aria-hidden="true">📷</span>}
                <span className={previewUrl ? "" : "text-gray-600"}>
                  {file ? file.name : previewUrl ? "Click to change photo" : "Click to choose a new photo"}
                </span>
                <span className={`mt-1 text-sm ${previewUrl ? "text-white/80" : "text-gray-400"}`}>
                  PNG, JPG, or WebP up to 5 MB
                </span>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)} />

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Gallery photos ({gallery.length}/5)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((image) => (
                  <div key={image.id} className="group relative">
                    <img src={getUploadUrl(image.image_url) ?? ""} alt="Salon gallery" className="aspect-square w-full rounded-lg object-cover" />
                    <button
                      type="button"
                      aria-label="Remove gallery photo"
                      title="Remove photo"
                      disabled={deletingGalleryImageId === image.id || isGalleryPending}
                      onClick={() => handleGalleryDelete(image.id)}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-lg leading-none text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {deletingGalleryImageId === image.id ? "…" : <IoClose />}
                    </button>
                  </div>
                ))}
                {galleryPreviewUrls.map((url, index) => (
                  <img key={url} src={url} alt={`New gallery photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover ring-2 ring-[#EF9A9A]" />
                ))}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? [])
                  const remainingSlots = 5 - gallery.length
                  setGalleryFiles(selected.slice(0, remainingSlots))
                  if (selected.length > remainingSlots) setError(`You can add ${remainingSlots} more gallery image${remainingSlots === 1 ? "" : "s"}.`)
                  else setError(null)
                }}
              />
              <div className="mt-3 flex gap-2">
                <Button className="bg-[#EBAFE2]" type="button" variant="outline" disabled={gallery.length >= 5 || isGalleryPending} onClick={() => galleryInputRef.current?.click()}>
                  Choose gallery photos
                </Button>
                {galleryFiles.length > 0 && (
                  <Button className="bg-[#EBAFE2] text-black" type="button" disabled={isGalleryPending} onClick={handleGalleryUpload}>
                    {isGalleryPending ? "Uploading…" : `Upload ${galleryFiles.length} photo${galleryFiles.length === 1 ? "" : "s"}`}
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Choose up to {5 - gallery.length} more. PNG, JPG, or WebP up to 5 MB each.</p>
            </div>
          </div>


          <Button type="submit" disabled={isPending || categories.length === 0 || regions.length === 0} className="w-full bg-[#EBAFE2] md:col-span-2">
            {isPending ? "Saving changes…" : "Save changes"}
          </Button>
          {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}
        </FieldGroup>
      </form>
    </main>
  )
}
