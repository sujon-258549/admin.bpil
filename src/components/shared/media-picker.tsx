import { useState } from "react"
import { Upload, X } from "lucide-react"
import { MediaUploadsModal } from "@/components/modal/media-uploads-modal"
import { Image } from "@/components/shared/image"

interface MediaPickerProps {
  value?: string | string[]
  onChange: (imageIds: any) => void
  label?: string
  width?: string
  height?: string
  className?: string
  category?: "single" | "multi"
}

export function MediaPicker({
  value,
  onChange,
  label = "Upload Image",
  width = "w-40",
  height = "h-40",
  className = "",
  category = "single",
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isMulti = category === "multi"
  const isArray = Array.isArray(value)
  const hasValue = isMulti ? isArray && value.length > 0 : !!value

  return (
    <>
      <div className={`relative group ${width} ${height} ${className}`}>
        <div 
          onClick={() => setIsOpen(true)}
          className="w-full h-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden relative"
        >
          {hasValue ? (
            isMulti && isArray ? (
              <div className="flex w-full h-full p-2 flex-wrap gap-2 overflow-y-auto">
                {value.map((id) => (
                  <Image 
                    key={id}
                    imageId={id}
                    alt="Selected" 
                    preview={false}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            ) : (
              <Image 
                imageId={value as string}
                alt={label} 
                preview={false}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8 opacity-50" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          )}
        </div>

        {hasValue && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onChange(isMulti ? [] : "")
            }}
            className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 shadow-md hover:bg-destructive/90"
            title="Clear selection"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <MediaUploadsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={category}
        initialSelectedIds={hasValue ? (isMulti && isArray ? (value as string[]) : [value as string]) : []}
        onSelect={(imageIds) => {
          if (isMulti) {
            onChange(imageIds)
          } else if (imageIds.length > 0) {
            onChange(imageIds[0])
          }
        }}
      />
    </>
  )
}
