import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type { Video } from "@/redux/features/videos"

export function VideoPreviewModal({
  video,
  onClose,
}: {
  video: Video
  onClose: () => void
}) {
  // DOM side-effects — lock body scroll + Escape key handler.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  // Prevent hydration mismatch if rendering on server, but Admin is usually SPA
  if (typeof document === "undefined") return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} video`}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:text-foreground sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-video w-full max-w-[95vw] max-h-[90vh] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300 sm:max-w-5xl"
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`${video.title} — BPIL reel`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>,
    document.body,
  )
}
