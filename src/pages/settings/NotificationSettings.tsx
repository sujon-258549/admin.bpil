import { Bell, PlayCircle, Volume2, VolumeX } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSoundEnabled, setNotificationSound, setVolume } from "@/redux/features/settings/settingsSlice"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Button } from "@/components/ui/button"

const SOUND_OPTIONS = [
  { label: "Pop 1", value: "/sounds/pop_1.wav" },
  { label: "Pop 2", value: "/sounds/pop_2.wav" },
  { label: "Pop 3", value: "/sounds/pop_3.wav" },
  { label: "Bell 1", value: "/sounds/bell_1.wav" },
  { label: "Bell 2", value: "/sounds/bell_2.wav" },
  { label: "Chime 1", value: "/sounds/chime_1.wav" },
  { label: "Chime 2", value: "/sounds/chime_2.wav" },
  { label: "Beep 1", value: "/sounds/beep_1.wav" },
  { label: "Beep 2", value: "/sounds/beep_2.wav" },
  { label: "Beep 3", value: "/sounds/beep_3.wav" },
  { label: "Success 1", value: "/sounds/success_1.wav" },
  { label: "Success 2", value: "/sounds/success_2.wav" },
  { label: "Error 1", value: "/sounds/error_1.wav" },
  { label: "Error 2", value: "/sounds/error_2.wav" },
  { label: "Click 1", value: "/sounds/click_1.wav" },
  { label: "Click 2", value: "/sounds/click_2.wav" },
  { label: "Synth 1", value: "/sounds/synth_1.wav" },
  { label: "Synth 2", value: "/sounds/synth_2.wav" },
  { label: "Alert 1", value: "/sounds/alert_1.wav" },
  { label: "Alert 2", value: "/sounds/alert_2.wav" },
  { label: "Messenger", value: "/sounds/messenger.wav" },
]

export function NotificationSettings() {
  const dispatch = useAppDispatch()
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled)
  const notificationSound = useAppSelector((state) => state.settings.notificationSound)
  const volume = useAppSelector((state) => state.settings.volume) ?? 1.0

  const handleTestSound = () => {
    if (notificationSound) {
      const audio = new Audio(notificationSound)
      audio.volume = volume
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
          <>
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

            <div className="pt-4 border-t flex flex-col gap-2">
              <div className="space-y-0.5">
                <Label className="text-base">Volume</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the loudness of notification sounds
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <VolumeX className="size-4 text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <Volume2 className="size-4 text-muted-foreground" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
