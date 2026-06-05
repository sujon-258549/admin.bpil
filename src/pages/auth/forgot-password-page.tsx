import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/paths";
import { getErrorMessage } from "@/lib/errors";
import { 
  useForgotPasswordMutation, 
  useResetPasswordMutation 
} from "@/redux/features/auth/auth-api";
import { PageMeta } from "@/components/shared";
import { OtpInput } from "@/components/common/otp-input";
import PasswordInput from "@/components/common/password-input";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address.");
    
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to send OTP"));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP.");
    if (!password) return toast.error("Please enter a new password.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");

    try {
      const res = await resetPassword({ email, otp, password }).unwrap();
      toast.success(res.message || "Password reset successfully!");
      navigate(ROUTES.AUTH.LOGIN);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to reset password"));
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "OTP resent to your email!");
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to resend OTP"));
    }
  };

  return (
    <div className="space-y-8">
      <PageMeta title="Forgot Password" description="Reset your password" />
      
      {step === 1 ? (
        <>
          <header className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your registered email address and we'll send you an OTP to reset your password.
            </p>
          </header>

          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSendingOtp}
            >
              {isSendingOtp && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSendingOtp ? "Sending..." : "Send Reset OTP"}
              {!isSendingOtp && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>
        </>
      ) : (
        <>
          <header className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              We've sent an OTP to <span className="font-medium text-foreground">{email}</span>
            </p>
          </header>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-4">
              <Label className="block text-center mb-2 text-muted-foreground">Enter 6-digit OTP code sent to your email</Label>
              <OtpInput value={otp} onChange={setOtp} length={6} />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
                <PasswordInput
                  id="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="New Password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
                <PasswordInput
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isResetting}
            >
              {isResetting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
            
            <div className="text-center lg:text-left pt-2">
              <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={isSendingOtp}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Didn't receive code? <span className="text-primary underline-offset-4 hover:underline">Resend OTP</span>
              </button>
            </div>
          </form>
        </>
      )}

      <div className="text-center lg:text-left pt-4">
        <Link 
          to={ROUTES.AUTH.LOGIN}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
