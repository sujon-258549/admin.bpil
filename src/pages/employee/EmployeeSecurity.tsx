import { useParams, Link } from "react-router-dom";
import { ShieldAlert, MonitorSmartphone, LogOut, ArrowLeft, Shield, Globe } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, PageMeta, SummaryCard, Text } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useGetLoginHistoryQuery, useGetUserByIdQuery, useForceLogoutSessionMutation } from "@/redux/features/users/users-api";
import { ROUTES } from "@/config/paths";
import { getErrorMessage } from "@/lib/errors";

export default function EmployeeSecurity() {
  const { id } = useParams<{ id: string }>();
  
  const { data: userResponse, isLoading: isLoadingUser } = useGetUserByIdQuery(id as string, {
    skip: !id,
  });
  const { data: historyResponse, isLoading: isLoadingHistory } = useGetLoginHistoryQuery(id as string, {
    skip: !id,
  });
  
  const [forceLogout, { isLoading: isLoggingOut }] = useForceLogoutSessionMutation();

  const user = userResponse?.data;
  const histories = historyResponse?.data || [];

  const activeSessions = histories.filter(h => h.isActive && h.status === "SUCCESS");
  const failedAttempts = histories.filter(h => h.status === "FAILED");
  const previousLogins = histories.filter(h => !h.isActive && h.status === "SUCCESS");

  const handleLogout = async (sessionId: string) => {
    try {
      const res = await forceLogout(sessionId).unwrap();
      if (res?.success) {
        toast.success(res.message || "Session logged out successfully");
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to log out session"));
    }
  };

  if (isLoadingUser || isLoadingHistory) {
    return <div className="p-8 text-center">Loading security details...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">Employee not found.</div>;
  }

  const renderSessionCard = (session: any, showLogout: boolean = false) => {
    const isFailed = session.status === "FAILED";
    
    return (
      <div key={session.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4 ${isFailed ? "bg-red-500/5 border-red-500/20" : "bg-card"}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${isFailed ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
            {isFailed ? <ShieldAlert className="size-6" /> : <MonitorSmartphone className="size-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Text className="font-semibold text-base">
                {session.os || "Unknown OS"} • {session.browser || "Unknown Browser"}
              </Text>
              {isFailed && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                  FAILED: {session.failureReason || "Unknown"}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="size-4" />
                {session.location || session.ipAddress || "Unknown Location"}
              </span>
              <span>
                <strong>IP:</strong> {session.ipAddress || "Unknown"}
              </span>
              <span>
                <strong>Device:</strong> {session.deviceType || "Desktop"}
              </span>
              <span>
                <strong>Time:</strong> {session.loggedInAt ? new Date(session.loggedInAt).toLocaleString() : "Unknown"}
              </span>
            </div>
          </div>
        </div>
        
        {showLogout && session.isActive && (
          <Button 
            variant="destructive" 
            onClick={() => handleLogout(session.id)}
            disabled={isLoggingOut}
            className="shrink-0 w-full sm:w-auto"
          >
            <LogOut className="size-4 mr-2" />
            Force Logout
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageMeta title={`Security: ${user.name}`} />
      
      <div className="flex items-center justify-between">
        <PageHeader
          title="Security & Logins"
          description={`Manage active sessions and view login history for ${user.name}`}
        />
        <Button variant="outline" asChild>
          <Link to={ROUTES.EMPLOYEES.LIST}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Employees
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Active Sessions"
          value={activeSessions.length}
          trend={activeSessions.length > 0 ? "positive" : "neutral"}
        />
        <SummaryCard
          title="Total Logins"
          value={previousLogins.length + activeSessions.length}
          trend="neutral"
        />
        <SummaryCard
          title="Failed Attempts"
          value={failedAttempts.length}
          trend={failedAttempts.length > 0 ? "negative" : "neutral"}
        />
      </div>

      {(user as any).isBlocked && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-4">
          <Shield className="size-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-destructive">Account Blocked</h3>
            <p className="text-sm text-destructive/90 mt-1">
              This account has been blocked automatically due to too many failed login attempts, or manually by an admin.
              Please unblock it from the Employee List to allow them to log in again.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-4 border-b pb-2">
        <h2 className="font-bold text-lg">Active ({activeSessions.length})</h2>
      </div>
      <div className="mt-4 space-y-4">
        {activeSessions.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground">
            No active sessions right now.
          </div>
        ) : (
          activeSessions.map(s => renderSessionCard(s, true))
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 border-b pb-2">
        <h2 className="font-bold text-lg">Failed Attempts ({failedAttempts.length})</h2>
      </div>
      <div className="mt-4 space-y-4">
        {failedAttempts.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground">
            No failed login attempts detected.
          </div>
        ) : (
          failedAttempts.map(s => renderSessionCard(s, false))
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 border-b pb-2">
        <h2 className="font-bold text-lg">History ({previousLogins.length})</h2>
      </div>
      <div className="mt-4 space-y-4">
        {previousLogins.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground">
            No login history found.
          </div>
        ) : (
          previousLogins.map(s => renderSessionCard(s, false))
        )}
      </div>
    </div>
  );
}
