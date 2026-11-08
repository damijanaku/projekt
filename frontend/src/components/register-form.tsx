import * as React from "react"
import { Link, useNavigate } from "react-router"
import { cn } from "cn"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./ui/field"
import { Input } from "./ui/input"
import { useAuth } from "../context/AuthContext"

type Role = "customer" | "salon_manager"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = React.useState<Role>("customer")
  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      role,
      first_name: String(form.get("first_name") ?? "").trim(),
      last_name: String(form.get("last_name") ?? "").trim(),
      ...(role === "salon_manager"
        ? { display_name: String(form.get("display_name") ?? "").trim() }
        : {
            default_region: String(form.get("default_region") ?? "").trim() || undefined,
            notes: String(form.get("notes") ?? "").trim() || undefined,
          }),
    }

    try {
      setIsPending(true)
      await register(payload)
      navigate("/login", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-none sm:border sm:shadow-xl sm:rounded-2xl">
        <CardHeader className="space-y-2 px-8 pt-8 text-center sm:pt-10">
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your account
          </CardTitle>
          <CardDescription className="text-base">
            Choose how you want to use the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 sm:pb-10">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              {/* Role selector */}
              <Field>
                <FieldLabel htmlFor="role" className="text-sm font-medium">
                  I am a
                </FieldLabel>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-base shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                >
                  <option value="customer">Customer</option>
                  <option value="salon_manager">Salon manager</option>
                </select>
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="first_name" className="text-sm font-medium">
                    First name
                  </FieldLabel>
                  <Input id="first_name" name="first_name" type="text" placeholder="Janez"
                    autoComplete="given-name" required className="h-11 text-base" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_name" className="text-sm font-medium">
                    Last name
                  </FieldLabel>
                  <Input id="last_name" name="last_name" type="text" placeholder="Novak"
                    autoComplete="family-name" required className="h-11 text-base" />
                </Field>
              </div>

              {/* Manager-only */}
              {role === "salon_manager" && (
                <Field>
                  <FieldLabel htmlFor="display_name" className="text-sm font-medium">
                    Salon name
                  </FieldLabel>
                  <Input id="display_name" name="display_name" type="text"
                    placeholder="ShinyNails" required className="h-11 text-base" />
                  <FieldDescription>This is what your customers will see.</FieldDescription>
                </Field>
              )}

              {/* Customer-only */}
              {role === "customer" && (
                <>
                  <Field>
                    <FieldLabel htmlFor="default_region" className="text-sm font-medium">
                      Default region <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Input id="default_region" name="default_region" type="text"
                      placeholder="Ljubljana" className="h-11 text-base" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="notes" className="text-sm font-medium">
                      Notes <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Input id="notes" name="notes" type="text"
                      placeholder="Anything we should know?" className="h-11 text-base" />
                  </Field>
                </>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                <Input id="email" name="email" type="email"
                  placeholder="janez.novak@example.com" autoComplete="email"
                  required className="h-11 text-base" />
              </Field>

              <Field>
                <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                <Input id="password" name="password" type="password"
                  autoComplete="new-password" minLength={8} required
                  className="h-11 text-base" />
                <FieldDescription>At least 8 characters.</FieldDescription>
              </Field>

              {error && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Field className="gap-4 pt-2">
                <Button type="submit" disabled={isPending}
                  className="h-11 w-full rounded-lg bg-[#EBAFE2] text-base font-semibold text-black shadow-sm transition-colors hover:bg-[#e29ada] active:bg-[#d888ce] disabled:opacity-60">
                  {isPending ? "Creating account…" : "Create account"}
                </Button>
                <FieldDescription className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Log in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}