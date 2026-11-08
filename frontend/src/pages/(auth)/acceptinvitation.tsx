import * as React from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { acceptInvitation } from "../../lib/api"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Field, FieldLabel, FieldGroup } from "../../components/ui/field"

export function AcceptInvitation() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = React.useState(params.get("token") ?? "")
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)

    const payload = {
      token: String(form.get("token") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      display_name: String(form.get("display_name") ?? "").trim(),
      bio: String(form.get("bio") ?? "").trim() || undefined,
      experience_years: form.get("experience_years")
        ? Number(form.get("experience_years"))
        : undefined,
      specialty: String(form.get("specialty") ?? "").trim() || undefined,
    }

    if (payload.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    try {
      setIsPending(true)
      await acceptInvitation(payload)
      navigate("/login", {
        replace: true,
        state: { message: "Account ready — please log in." },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept invitation")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Finish setting up your account
        </h1>
        <p className="text-sm text-muted-foreground">
          You've been invited to join a salon as a nail artist. Set a password and
          a display name to activate your account.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="token" className="text-sm font-medium">
                Invitation token
              </FieldLabel>
              <Input
                id="token"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the token from your email"
                autoComplete="off"
                required
                className="h-11 text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-sm font-medium">
                Password
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
                className="h-11 text-base"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="display_name" className="text-sm font-medium">
                Display name
              </FieldLabel>
              <Input
                id="display_name"
                name="display_name"
                placeholder="How clients will see you"
                autoComplete="nickname"
                required
                className="h-11 text-base"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="experience_years" className="text-sm font-medium">
                  Years of experience
                  <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min={0}
                  step={1}
                  className="h-11 text-base"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="specialty" className="text-sm font-medium">
                  Specialty
                  <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="specialty"
                  name="specialty"
                  placeholder="e.g. Gel nails, Nail art"
                  className="h-11 text-base"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="bio" className="text-sm font-medium">
                Bio
                <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="bio"
                name="bio"
                placeholder="A short intro for your profile"
                className="h-11 text-base"
              />
            </Field>

            {error && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-[#EBAFE2] text-base font-semibold text-black shadow-sm transition-colors hover:bg-[#e29ada] active:bg-[#d888ce] disabled:opacity-60"
            >
              {isPending ? "Creating account…" : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}