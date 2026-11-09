import * as React from "react"
import { Link, useNavigate } from "react-router"
import { ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/button"
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import {
  createSalon,
  getMySalon,
  getSalonCategories,
  type SalonCategory,
} from "../../lib/api"
import { useEffect } from "react"


export default function CreateSalon() {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = React.useState<SalonCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [file, SetFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      SetFile(e.target.files[0])
    }
  }


  useEffect(() => {
    if (!accessToken || user?.role !== "salon_manager") {
      navigate("/dashboard", { replace: true })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { salon } = await getMySalon(accessToken)
        if (cancelled) return
        if (salon) {
          navigate("/dashboard", { replace: true })
          return
        }

        const data = await getSalonCategories()
        if (!cancelled) setCategories(data.categories)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load salon setup")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accessToken, navigate, user?.role])

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!accessToken) {
      setError("Please log in again to create your salon")
      return
    }

    const form = new FormData(event.currentTarget)
    const categoryId = Number(form.get("category_id"))

    try {
      setIsPending(true)
      await createSalon({
        name: String(form.get("name") ?? "").trim(),
        description: String(form.get("description") ?? "").trim(),
        category_id: categoryId,
        region: String(form.get("region") ?? "").trim(),
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
      setError(submitError instanceof Error ? submitError.message : "Could not create salon")
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) {
    return <main className="mx-auto w-full max-w-2xl px-4 py-10">Loading salon setup…</main>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto mb-8 w-full max-w-5xl space-y-2">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create your salon</h1>
        <p className="text-sm text-muted-foreground">Add your salon details so clients can find you.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <FieldGroup className="grid grid-cols-2">
          <div className="col-span-1 space-y-4">
            <Field>
            <FieldLabel htmlFor="name">Salon name</FieldLabel>
            <Input id="name" name="name" required maxLength={150} />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category_id">Category</FieldLabel>
            <div className="relative">
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue=""
                className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-3 pr-0 text-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="region">Region</FieldLabel>
              <Input id="region" name="region" required maxLength={100} />
            </Field>
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" name="city" required maxLength={100} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="address">Street address</FieldLabel>
            <Input id="address" name="address" required maxLength={255} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="postal_code">Postal code</FieldLabel>
              <Input id="postal_code" name="postal_code" required maxLength={20} />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input id="phone" name="phone" type="tel" required maxLength={30} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required maxLength={255} />
          </Field>

          <Field>
            <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
            <Input id="instagram" name="instagram" required maxLength={255} placeholder="@your-salon" />
          </Field>

          
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#EBAFE2]">
              Upload your profile photo
            </label>
            
            <div
                className={`border-2 border-dashed rounded-lg p-8 h h-97/100 text-center hover:border-[#EF9A9A] transition-colors cursor-pointer ${file ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                onClick={handleUploadClick}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <p>📷</p>
                    <p className="text-gray-600">{file ? 'File selected' : 'Click or drag to upload'}</p>
                    <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        id="file"
                        name="image"
                        ref={fileInputRef}
                        onClick={(event) => event.stopPropagation()}
                        onChange={handleFileChange}
                    />
                    {file && (
                        <p className="text-sm text-green-600 mt-2 font-semibold">
                           {file.name}
                        </p>
                    )}
                </div>

            </div>
            
          </div>

          <Button type="submit" disabled={isPending || categories.length === 0} className="w-full col-span-2 bg-[#EBAFE2]">
            {isPending ? "Creating salon…" : "Create salon"}
          </Button>
          

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          
        </FieldGroup>
      </form>
    </main>
  )
}
