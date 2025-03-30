"use client";
import { Order } from "@/app/types/Order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
  Label,
} from "@/components/ui";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import moment from "moment";
import { Description } from "@radix-ui/react-dialog";
import ui from "@/app/data/ui.json";
import { useUpdateOrder } from "@/hooks/api/useOrderData";

type Props = {
  dialog: boolean;
  trigger: () => void;
  data: Order;
  fetchSalesData: () => void;
};

export function OrderDialog({ dialog, trigger, data, fetchSalesData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Order>({
    defaultValues: data,
  });

  const deadline = useWatch({
    control,
    name: "deadline",
    defaultValue: data.deadline,
  });

  const mutation = useUpdateOrder();

  const onSubmit: SubmitHandler<Order> = (formData) => {
    mutation.mutate(formData);
    trigger();
    fetchSalesData();
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ui.global.edit_order}</DialogTitle>
          <Description />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.customer_name} *</Label>
            <Input {...register("client", { required: true })} />
            {errors.client && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.email}</Label>
            <Input {...register("email")} />
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.phone_required} *</Label>
            <Input {...register("phone", { required: true })} />
            {errors.phone && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.address}</Label>
            <Input {...register("address")} />
          </div>
          <div style={{ paddingBottom: "1rem" }} className="relative">
            <Label>{ui.global.deadline_days}</Label>
            <Input type="number" {...register("deadline")} />
            <div className="absolute right-3 top-9 text-sm text-zinc-500">
              {moment(data.date)
                .add(Number(deadline), "days")
                .format("MM/DD/YYYY")}
            </div>
          </div>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.prepayment}</Label>
            <Input type="number" step="0.01" {...register("prepayment")} />
          </div>
          <Button type="submit">{ui.global.save}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
