import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AlertCircle, Mail, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordInput from "@/components/common/password-input"
import { useAppDispatch } from "@/redux/hooks"
import { performLogin } from "@/redux/features/auth/auth-slice"
import { useLoginMutation } from "@/redux/features/auth/auth-api"
import { ROUTES } from "@/config/paths"

interface ApiErrorBody {
  message?: string
}

interface FetchBaseQueryError {
  status?: number | string
  data?: ApiErrorBody
}

const extractErrorMessage = (err: unknown): string => {
  const fbq = err as FetchBaseQueryError
  if (fbq?.data?.message) return fbq.data.message
  if (fbq?.status === "FETCH_ERROR") return "Cannot reach the server. Is it running?"
  return "Login failed. Please check your credentials."
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    try {
      const res = await login({ email, password }).unwrap()
      if (import.meta.env.DEV) console.log("[Login] response payload", res)

      // Accept multiple common backend field naming patterns.
      const raw = res as unknown as Record<string, unknown>
      const accessToken =
        (raw.accessToken as string) ||
        (raw.access_token as string) ||
        (raw.token as string)
      const refreshToken =
        (raw.refreshToken as string) ||
        (raw.refresh_token as string) ||
        accessToken
      const user =
        (raw.user as typeof res.user) ?? (raw as unknown as typeof res.user)

      if (!accessToken) {
        throw new Error(
          "Login succeeded but no access token found in response. Check backend response shape.",
        )
      }

      dispatch(performLogin({ user, accessToken, refreshToken }))
      toast.success(`Welcome back, ${user?.name ?? "user"}`)
      // "/" hits SmartIndex which routes the user to their first accessible
      // module (or /access-denied if no permissions are granted).
      navigate(ROUTES.ROOT)
    } catch (err) {
      const msg = extractErrorMessage(err)
      setErrorMsg(msg)
      toast.error(msg)
      console.error("[Login error]", err)
    }
  }

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="space-y-3">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2 ring-1 ring-inset ring-primary/20">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Secure Login
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Enter your credentials to securely access your workspace and manage your business.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        {errorMsg && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email address</Label>
            <div className="relative group">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="pl-12 h-14 rounded-2xl bg-background/50 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-14 rounded-2xl bg-background/50 backdrop-blur-sm border-border hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-base"
              />
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground select-none group w-max">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer size-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-transparent transition-all checked:border-primary checked:bg-primary hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
            />
            <svg
              className="pointer-events-none absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="group-hover:text-foreground transition-colors font-medium">Remember me on this device</span>
        </label>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 group" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Sign in to Dashboard
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
