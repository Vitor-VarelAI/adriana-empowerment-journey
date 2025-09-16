"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { pt } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm max-w-sm mx-auto">
      <DayPicker
        locale={pt}
        weekStartsOn={1}
        showOutsideDays={showOutsideDays}
        className={cn("rdp-calendar", className)}
        classNames={{
          months: "rdp-months",
          month: "rdp-month space-y-4",
          caption: "rdp-caption flex justify-center relative items-center mb-6 px-10",
          caption_label: "rdp-caption_label text-xl font-semibold text-gray-900 capitalize",
          nav: "rdp-nav flex items-center",
          nav_button: cn(
            "rdp-nav_button",
            "h-9 w-9 bg-gray-50 border-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 rounded-lg absolute flex items-center justify-center"
          ),
          nav_button_previous: "rdp-nav_button_previous left-0",
          nav_button_next: "rdp-nav_button_next right-0",
          table: "rdp-table w-full border-collapse",
          head_row: "rdp-head_row flex w-full mb-3",
          head_cell: "rdp-head_cell text-gray-500 font-medium text-xs text-center flex-1 py-2 uppercase tracking-wider",
          row: "rdp-row flex w-full mb-1",
          cell: "rdp-cell text-center text-sm p-0 relative flex-1 h-10 flex items-center justify-center",
          day: cn(
            "rdp-day",
            "h-10 w-10 p-0 font-medium text-gray-700 hover:bg-brown/8 hover:text-brown transition-all duration-200 rounded-lg flex items-center justify-center relative"
          ),
          day_selected: "rdp-day_selected bg-brown text-white hover:bg-brown/90 hover:text-white focus:bg-brown focus:text-white shadow-lg ring-2 ring-brown ring-offset-2 transform scale-110 animate-pulse-once",
          day_today: "rdp-day_today bg-brown/5 text-brown font-semibold ring-2 ring-brown/30",
          day_outside: "rdp-day_outside text-gray-300 hover:text-gray-400",
          disabled: "rdp-disabled !text-gray-300 !cursor-not-allowed hover:!bg-transparent hover:!text-gray-300 !opacity-40 !pointer-events-none !line-through relative",
          day_hidden: "rdp-day_hidden invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
