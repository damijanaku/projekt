import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { inviteNailArtist } from "@/lib/api"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@base-ui/react/input"
import { Button } from "@base-ui/react/button"

const InviteArtist = () => {
  const { accessToken } = useAuth()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const formElement = e.currentTarget
    const form = new FormData(formElement)
    const email = String(form.get("email") ?? "").trim()
    const first_name = String(form.get("first_name") ?? "").trim()
    const last_name = String(form.get("last_name") ?? "").trim()

    if (!accessToken) {
      setError("You must be logged in as a salon manager")
      return
    }

    try {
      setIsPending(true)
      const res = await inviteNailArtist({ email, first_name, last_name }, accessToken)
      setSuccess(
        `Invitation sent to ${res.email}. It expires ${new Date(res.expires_at).toLocaleString()}.`
      )
      formElement.reset()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not send invitation")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Invite a nail artist
        </h1>
        <p className="text-sm text-muted-foreground">
          We'll email them a secure link to finish setting up their account.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                Email
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="artist@example.com"
                autoComplete="email"
                required
                className="h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-[#EBAFE2]"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="first_name" className="text-sm font-medium">
                  First name
                </FieldLabel>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Ana"
                  autoComplete="given-name"
                  required
                  className="h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-[#EBAFE2]"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="last_name" className="text-sm font-medium">
                  Last name
                </FieldLabel>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Novak"
                  autoComplete="family-name"
                  required
                  className="h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-[#EBAFE2]"
                />
              </Field>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-[#EBAFE2] text-base font-semibold text-black shadow-sm transition-colors hover:bg-[#e29ada] active:bg-[#d888ce] disabled:opacity-60">
              {isPending ? "Sending…" : "Send invitation"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

export default InviteArtist
