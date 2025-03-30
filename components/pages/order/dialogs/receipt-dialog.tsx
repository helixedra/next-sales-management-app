"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Description } from "@radix-ui/react-dialog";
import account from "@/app/data/account.json";
import ui from "@/app/data/ui.json";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarForm } from "./CalendarFrom";
import ServiceSupplierSelect from "./ServiceSupplierSelect";

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

export function ReceiptDialog({ dialog, trigger, number }: Props) {
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
      `/reports/receipt?number=${data.number}&supplier=${encodeURIComponent(
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
            {ui.global.generate_receipt}
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
            <div className="flex items-center py-4">
              <Checkbox
                {...register("signature")}
                id="signature"
                defaultChecked
                className="mr-2"
                onCheckedChange={(value: boolean) =>
                  setValue("signature", value)
                }
              />
              <Label htmlFor="signature" className="cursor-pointer">
                {ui.global.signature}
              </Label>
            </div>
          </div>
          <Button type="submit">{ui.global.generate}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
