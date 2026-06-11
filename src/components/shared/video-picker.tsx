import { useState } from "react"
import { Video as VideoIcon, X, Loader2, Check } from "lucide-react"
import { Image } from "@/components/shared/image"
import { useVideo } from "@/hooks/data-fetch/use-video"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VideoPickerProps {
  value?: string[]
  onChange: (videoIds: string[]) => void
  label?: string
  className?: string
}

export function VideoPicker({
  value = [],
  onChange,
  label = "Add Videos",
  className = "",
}: VideoPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className={`relative group ${className}`}>
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full h-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden relative min-h-[8rem]"
        >
          {value.length > 0 ? (
            <div className="flex w-full h-full p-2 flex-wrap gap-2 overflow-y-auto">
              {value.map((id) => (
                <SelectedVideoItem key={id} videoId={id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
              <VideoIcon className="h-8 w-8 opacity-50" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          )}
        </div>

        {value.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange([])
            }}
            className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 shadow-md hover:bg-destructive/90"
            title="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <VideoSelectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialSelectedIds={value}
        onSelect={(videoIds) => {
          onChange(videoIds)
          setIsOpen(false)
        }}
      />
    </>
  )
}

function SelectedVideoItem({ videoId }: { videoId: string }) {
  // Use a query hook if there is one for single video, or just fetch all and find
  const { videos, isLoading } = useVideo({ limit: 100 })
  const video = videos.find(v => v.id === videoId)

  if (isLoading && !video) {
    return (
      <div className="w-24 h-16 flex items-center justify-center bg-muted/50 rounded-md border">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!video) {
    return <div className="w-24 h-16 bg-muted border rounded-md flex items-center justify-center text-xs text-muted-foreground">Not found</div>
  }

  return (
    <div className="relative group/item overflow-hidden rounded-md border bg-muted/20 w-24 h-16 shrink-0" title={video.title}>
      {video.posterId ? (
        <Image 
          imageId={video.posterId}
          alt={video.title} 
          preview={false}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black">
           <VideoIcon className="h-6 w-6 text-white/50" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4">
        <p className="truncate text-[10px] font-medium text-white">{video.title}</p>
      </div>
    </div>
  )
}

interface VideoSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  initialSelectedIds: string[]
  onSelect: (videoIds: string[]) => void
}

function VideoSelectionModal({ isOpen, onClose, initialSelectedIds, onSelect }: VideoSelectionModalProps) {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 300)
  
  const { videos, isLoading } = useVideo({ page: 1, limit: 50, searchTerm: debounced || undefined })
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    onSelect(selectedIds)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Select Videos</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b bg-muted/20">
          <Input 
            placeholder="Search videos by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md bg-background"
          />
        </div>

        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
              <VideoIcon className="mb-2 h-10 w-10 opacity-20" />
              <p>No videos found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map(video => {
                const isSelected = selectedIds.includes(video.id)
                return (
                  <div 
                    key={video.id}
                    onClick={() => toggleSelect(video.id)}
                    className={`relative rounded-md border cursor-pointer overflow-hidden transition-all duration-200 aspect-video group ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-primary/50'}`}
                  >
                    {video.posterId ? (
                      <Image 
                        imageId={video.posterId}
                        alt={video.title} 
                        preview={false}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/90">
                         <VideoIcon className="h-8 w-8 text-white/50" />
                      </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
                      <p className="truncate text-xs font-medium text-white">{video.title}</p>
                      <p className="truncate text-[10px] font-mono text-white/70">{video.youtubeId}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                    
                    {!isSelected && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} video{selectedIds.length !== 1 && 's'} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm Selection</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
