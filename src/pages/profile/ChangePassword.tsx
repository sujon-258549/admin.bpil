import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, PageMeta, FormField } from "@/components/shared"
import { useChangePasswordMutation } from "@/redux/features/users/users-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { getErrorMessage } from "@/lib/errors"

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.")
      return
    }

    try {
      const res = await changePassword({
        oldPassword: currentPassword,
        newPassword
      }).unwrap()
      
      if (res.success) {
        toast.success(res.message || "Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to change password."))
    }
  }

  return (
    <div className="space-y-6 w-full mx-auto">
      <PageMeta title="Change Password" description="Update your account password" />
      <PageHeader
        title="Change Password"
        description="Ensure your account is using a long, random password to stay secure."
      />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField label="Current Password" required htmlFor="currentPassword">
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="New Password" required htmlFor="newPassword">
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm New Password" required htmlFor="confirmPassword">
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </FormField>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
