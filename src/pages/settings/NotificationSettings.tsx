import { Bell, PlayCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSoundEnabled, setNotificationSound } from "@/redux/features/settings/settingsSlice"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Button } from "@/components/ui/button"

const SOUND_OPTIONS = [
  { label: "Messenger", value: "/sounds/messenger.wav" },
  { label: "Pop", value: "/sounds/pop.wav" },
  { label: "Bell", value: "/sounds/bell.wav" },
]

export function NotificationSettings() {
  const dispatch = useAppDispatch()
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled)
  const notificationSound = useAppSelector((state) => state.settings.notificationSound)

  const handleTestSound = () => {
    if (notificationSound) {
      const audio = new Audio(notificationSound)
      audio.play().catch(console.error)
    }
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <Bell className="size-5 text-primary" />
        <h3 className="font-semibold">Notification Settings</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Notification Sounds</Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when a new notification arrives
            </p>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={(checked) => dispatch(setSoundEnabled(checked))}
          />
        </div>

        {soundEnabled && (
          <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-base">Alert Sound</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred notification tone
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CustomSelect
                value={notificationSound}
                onChange={(val: string) => dispatch(setNotificationSound(val))}
                placeholder="Select sound"
              >
                {SOUND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CustomSelect>
              <Button
                variant="outline"
                size="icon"
                onClick={handleTestSound}
                title="Play test sound"
              >
                <PlayCircle className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
