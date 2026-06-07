import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type DateRangeOption = 
  | "TODAY" 
  | "YESTERDAY" 
  | "THIS_WEEK" 
  | "LAST_WEEK" 
  | "THIS_MONTH" 
  | "LAST_MONTH" 
  | "THIS_YEAR" 
  | "LAST_YEAR" 
  | "CUSTOM"
  | ""

interface DateRangeFilterProps {
  onRangeChange: (startDate?: string, endDate?: string) => void;
  className?: string;
}

export function DateRangeFilter({ onRangeChange, className }: DateRangeFilterProps) {
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>("")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  useEffect(() => {
    if (selectedOption === "CUSTOM") {
      if (customStart || customEnd) {
        onRangeChange(customStart || undefined, customEnd || undefined)
      } else {
        onRangeChange(undefined, undefined)
      }
      return
    }

    if (!selectedOption) {
      onRangeChange(undefined, undefined)
      return
    }

    const now = new Date()
    let start = new Date()
    let end = new Date()

    switch (selectedOption) {
      case "TODAY":
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "YESTERDAY":
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        end.setDate(end.getDate() - 1)
        end.setHours(23, 59, 59, 999)
        break
      case "THIS_WEEK":
        // Sunday as first day of week
        start.setDate(now.getDate() - now.getDay())
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "LAST_WEEK":
        start.setDate(now.getDate() - now.getDay() - 7)
        start.setHours(0, 0, 0, 0)
        end = new Date(start)
        end.setDate(end.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        break
      case "THIS_MONTH":
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "LAST_MONTH":
        start.setMonth(now.getMonth() - 1, 1)
        start.setHours(0, 0, 0, 0)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        end.setHours(23, 59, 59, 999)
        break
      case "THIS_YEAR":
        start.setMonth(0, 1)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "LAST_YEAR":
        start = new Date(now.getFullYear() - 1, 0, 1)
        end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
        break
    }

    onRangeChange(start.toISOString(), end.toISOString())
  }, [selectedOption, customStart, customEnd, onRangeChange])

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <div className="flex items-center gap-2 w-48">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-transparent text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <CustomSelect
            value={selectedOption}
            onChange={(v: string) => {
              setSelectedOption(v as DateRangeOption)
              if (v !== "CUSTOM") {
                setCustomStart("")
                setCustomEnd("")
              }
            }}
            placeholder="Select Date"
          >
          <option value="">All Time</option>
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
          <option value="THIS_WEEK">This Week</option>
          <option value="LAST_WEEK">Last Week</option>
          <option value="THIS_MONTH">This Month</option>
          <option value="LAST_MONTH">Last Month</option>
          <option value="THIS_YEAR">This Year</option>
          <option value="LAST_YEAR">Last Year</option>
          <option value="CUSTOM">Custom</option>
        </CustomSelect>
        </div>
      </div>

      {selectedOption === "CUSTOM" && (
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-md border">
          <Input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="h-8 w-[140px] text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={(e) => {
              if ("showPicker" in e.currentTarget) {
                try { e.currentTarget.showPicker() } catch (err) { console.debug("Picker error:", err) }
              }
            }}
          />
          <span className="text-muted-foreground text-xs font-medium">to</span>
          <Input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="h-8 w-[140px] text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={(e) => {
              if ("showPicker" in e.currentTarget) {
                try { e.currentTarget.showPicker() } catch (err) { console.debug("Picker error:", err) }
              }
            }}
          />
          {(customStart || customEnd) && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 rounded-full hover:bg-muted"
              onClick={() => {
                setCustomStart("")
                setCustomEnd("")
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
