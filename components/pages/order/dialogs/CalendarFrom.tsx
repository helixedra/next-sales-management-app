"use client";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ui from "@/app/data/ui.json";

export function CalendarForm({
  register,
  setValue,
}: {
  register: any;
  setValue: any;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isOpen, setIsOpen] = useState(false);

  const field = {
    value: selectedDate,
    onChange: (date: Date | undefined | null) => {
      if (date) {
        setSelectedDate(date);
        setValue("date", date);
      } else {
        setSelectedDate(undefined);
        setValue("date", undefined);
      }
      setIsOpen(false);
    },
  };

  return (
    <>
      <input
        type="hidden"
        {...register("date")}
        value={selectedDate ? selectedDate.toISOString() : ""}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>{ui.global.pick_date}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
