import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { env } from "@/config/env"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  preview?: boolean
  imageId?: string
}

export function Image({ preview = false, imageId, className, onClick, ...props }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const finalSrc = imageId ? `${env.API_URL}/folder/image/${imageId}` : props.src

  const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (preview) {
      e.stopPropagation()
      setIsOpen(true)
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <>
      <img
        {...props}
        src={finalSrc}
        onClick={handleClick}
        className={`${className || ""} ${preview ? "cursor-pointer" : ""}`}
      />

      {preview && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                {...props}
                src={finalSrc}
                alt={props.alt || "Preview"}
                className="max-w-full max-h-full object-contain rounded-md"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
