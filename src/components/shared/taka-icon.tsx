import * as React from "react"
import { FaBangladeshiTakaSign } from "react-icons/fa6"
import { cn } from "@/lib/utils"

export function TakaIcon({
  className,
  size = 16,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <FaBangladeshiTakaSign
      className={cn("shrink-0", className)}
      size={size}
      {...(props as any)}
    />
  )
}
