"use client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Description } from "@radix-ui/react-dialog";
import account from "@/app/data/account.json";
import ui from "@/app/data/ui.json";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ServiceSupplierSelect from "./ServiceSupplierSelect";
import { CalendarForm } from "./CalendarFrom";

type FormValues = {
  number: number;
  supplier: string;
  date: Date;
  signature: boolean;
};

type Props = {
  dialog: boolean;
  trigger: () => void;
  number: number;
};

export function RequestFormDialog({ dialog, trigger, number }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      number: number,
      supplier: account.finance.data_options[0].ipn,
      date: new Date(),
      signature: true,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    window.open(
      `/reports/request?number=${data.number}&supplier=${encodeURIComponent(
        data.supplier
      )}&date=${format(data.date, "dd/MM/yyyy")}&signature=${
        data.signature ? "true" : "false"
      }`,
      "_blank"
    );
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {ui.global.generate_request}
          </DialogTitle>
          <Description className="text-sm text-gray-500" />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              {ui.global.date}
            </label>
            <CalendarForm register={register} setValue={setValue} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              {ui.global.supplier}
            </label>
            <ServiceSupplierSelect
              register={register}
              setValue={setValue}
              options={account.finance.data_options}
            />
          </div>
          <div className="flex items-center py-4">
            <Checkbox
              {...register("signature")}
              id="signature"
              defaultChecked
              className="mr-2"
              onCheckedChange={(value: boolean) => setValue("signature", value)}
            />
            <Label htmlFor="signature" className="cursor-pointer">
              {ui.global.signature}
            </Label>
          </div>
          <Button type="submit">{ui.global.generate}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
