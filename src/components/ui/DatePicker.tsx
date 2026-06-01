"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonRadix } from "@/components/ui/radix/buttonRadix";
import { cn } from "./utils";

export function DatePickerDemo({
  onChange,
}: {
  onChange: (...event: Date[]) => void;
}) {
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonRadix
          variant="outline"
          data-empty={!date}
          className="h-12 w-full rounded-xl py-4.5 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? (
            date.toLocaleDateString("ko-KR")
          ) : (
            <span className="text-gray-300">연도 - 월 - 일</span>
          )}
          <CalendarIcon />
        </ButtonRadix>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (!date) return;
            setDate(date);
            setOpen(false);
            onChange(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
