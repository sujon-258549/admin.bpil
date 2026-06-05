import { useEffect } from "react"
import { io as socketIO, type Socket } from "socket.io-client"
import { env } from "@/config/env"
import { useCurrentUser } from "@/hooks/use-permission"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { baseApi } from "@/redux/api/base-api"

// Socket server lives at the API host root, not under /api/v1.
// Strip any path off VITE_API_URL so the socket handshake hits the right
// origin regardless of how the env is configured.
const SOCKET_URL = (() => {
  try {
    return new URL(env.API_URL).origin
  } catch {
    return env.API_URL.replace(/\/api\/v\d+$/, "")
  }
})()

// Listens for a server-emitted `force-reload` event scoped to this user's
// socket room. When the event arrives (e.g. an admin just changed this
// user's role permissions), the window hard-reloads so the sidebar +
// route guards re-evaluate against the new grants and the user is kicked
// off any page they no longer have access to.
//
// Backend joins each user to a room keyed by their userId — see
// muster_erp_crm.backend/src/app/utils/socket.ts.
export function ForceReloadWatcher() {
  const user = useCurrentUser()
  const userId = user?.id
  const dispatch = useAppDispatch()
  
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled)
  const notificationSound = useAppSelector((state) => state.settings.notificationSound)

  useEffect(() => {
    if (!userId) return

    const socket: Socket = socketIO(SOCKET_URL, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
    })

    socket.on("force-reload", () => {
      window.location.reload()
    })

    const handleNotification = () => {
      dispatch(baseApi.util.invalidateTags(["Notifications"]))
      
      if (soundEnabled && notificationSound) {
        const audio = new Audio(notificationSound)
        audio.play().catch((err) => {
          console.warn("Autoplay prevented for notification sound:", err)
        })
      }
    }

    socket.on("notifications-refresh", handleNotification)
    socket.on("new-notification", handleNotification)

    return () => {
      socket.off("force-reload")
      socket.off("notifications-refresh", handleNotification)
      socket.off("new-notification", handleNotification)
      socket.disconnect()
    }
  }, [userId, soundEnabled, notificationSound, dispatch])

  return null
}
