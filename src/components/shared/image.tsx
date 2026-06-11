import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { env } from "@/config/env";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  preview?: boolean;
  imageId?: string;
}

export function Image({
  preview = false,
  imageId,
  className,
  onClick,
  ...props
}: ImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const finalSrc = imageId
    ? `${env.API_URL}/folder/image/${imageId}`
    : props.src;

  const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (preview) {
      e.stopPropagation();
      setIsOpen(true);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <>
      {preview ? (
        <div
          onClick={handleClick}
          className={`relative group cursor-pointer overflow-hidden ${className || ""}`}
        >
          <img
            {...props}
            src={finalSrc}
            className={`w-full h-full ${className?.includes("object-") ? "" : "object-cover"} ${className || ""}`}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Eye className="w-6 h-6 text-white/90 drop-shadow-md" />
          </div>
        </div>
      ) : (
        <img
          {...props}
          src={finalSrc}
          onClick={handleClick}
          className={className || ""}
        />
      )}

      {preview && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-6 bg-zinc-950/90 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center rounded-xl">
            <img
              {...props}
              src={finalSrc}
              alt={props.alt || "Preview"}
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
