import * as React from "react"
import { Link, useNavigate } from "react-router"
import { cn } from "cn"

import { Button } from "./ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { useAuth } from "../context/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [isPending, setIsPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") ?? "").trim()
    const password = String(form.get("password") ?? "")

    try {
      setIsPending(true)
      await login(email, password)
      navigate("/", { replace: true })
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Enter your login information to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 sm:pb-10">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                <Input id="email" name="email" type="email"
                  placeholder="janez.novak@example.com" autoComplete="email"
                  required className="h-11 text-base" />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm font-medium">Password</FieldLabel>
                  <a href="#" className="ml-auto inline-block text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" name="password" type="password"
                  autoComplete="current-password" required className="h-11 text-base" />
              </Field>

              {error && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Field className="gap-4 pt-2">
                <Button type="submit" disabled={isPending}
                  className="h-11 w-full rounded-lg bg-[#EBAFE2] text-base font-semibold text-black shadow-sm transition-colors hover:bg-[#e29ada] active:bg-[#d888ce] disabled:opacity-60">
                  {isPending ? "Logging in…" : "Login"}
                </Button>
                <FieldDescription className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Sign up
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