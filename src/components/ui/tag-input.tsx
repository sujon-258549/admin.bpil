import React, { useState, useRef, useEffect } from "react"
import type { KeyboardEvent } from "react"
import { X, CornerDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
}

export function TagInput({ value, onChange, className, placeholder, suggestions = [], ...props }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addTag = (tag: string) => {
    const newTag = tag.trim()
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag])
    }
    setInputValue("")
    setOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[6px] border border-input bg-transparent px-3 py-1.5 text-base transition-[color,box-shadow] outline-none focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 md:text-sm dark:bg-input/30",
          className
        )}
      >
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-sm font-medium border border-primary/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-full outline-none hover:bg-primary-foreground/20 focus:ring-2 focus:ring-ring"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </span>
        ))}
        <div className="flex-1 flex items-center min-w-[120px]">
          <input
            type="text"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            {...props}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="ml-1 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {open && filteredSuggestions.length > 0 && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 p-1">
          {filteredSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => addTag(suggestion)}
              className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
