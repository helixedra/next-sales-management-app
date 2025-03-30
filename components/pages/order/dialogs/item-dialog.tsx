"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea, Input, Label, Button } from "@/components/ui";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Item } from "@/app/types/Item";
import { Description } from "@radix-ui/react-dialog";
import { useUpdateItem } from "@/hooks/api/useOrderData";
import { useQueryClient } from "@tanstack/react-query";
import ui from "@/app/data/ui.json";

interface FormValues extends Item {
  _discount: number;
}

interface ItemDialogProps {
  saleNumber: string | number;
  dialog: boolean;
  trigger: () => void;
  data: Item | null;
  fetchSalesData: () => void;
}

export function ItemDialog({ saleNumber, dialog, trigger, data, fetchSalesData }: ItemDialogProps) {
  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data || {},
  });

  const quantity = watch("quantity");
  const price = watch("price");
  const _discount = watch("_discount"); // discount in percentage

  useEffect(() => {
    if (data) {
      reset(data);
      setValue("_discount", Number(data.discount) * 100);
    }
  }, [data, reset, setValue]);

  // Discount stored in DB in decimal format (discount)
  // Discount displayed in UI in percentage format (_discount)
  useEffect(() => {
    const discount = _discount / 100; // discount in decimal
    setValue("discount", discount.toFixed(2));
    const total = Number(quantity) * Number(price) * (1 - discount);
    setValue("total", total);
  }, [quantity, price, _discount, setValue]);

  useEffect(() => {
    const discount = watch("discount");
    const _discount = Number(discount) * 100;
    setValue("_discount", _discount);
  }, [watch("discount"), setValue]);

  const queryClient = useQueryClient();

  // Replace the direct useMutation with the custom hook
  const updateItemMutation = useUpdateItem();

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const parsedFormData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      discount: Number(formData.discount),
      total: Number(formData.total),
      order_number: saleNumber,
    };

    updateItemMutation.mutate(parsedFormData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        trigger();
        fetchSalesData();
      },
      onError: (error: any) => {
        console.error("Error updating Item:", error);
      },
    });
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
            <Label>{ui.global.item_description} *</Label>
            <Textarea {...register("description", { required: true })} />
            {errors.description && <span>{ui.global.field_required}</span>}
          </div>
          <div style={{ display: "flex", gap: "1rem", paddingBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.quantity} *</Label>
              <Input type="number" {...register("quantity", { required: true })} />
              {errors.quantity && <span>{ui.global.field_required}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.price} *</Label>
              <Input type="number" {...register("price", { required: true })} />
              {errors.price && <span>{ui.global.field_required}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.discount_percentage}</Label>
              <Input
                type="number"
                {...register("_discount", { required: true, min: 0, max: 100 })}
              />
              {errors._discount && <span>{ui.global.discount_range}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <Label>{ui.global.total}</Label>
              <Input type="number" {...register("total", { required: true })} readOnly />
              {errors.total && <span>{ui.global.field_required}</span>}
            </div>
          </div>
          <input type="hidden" {...register("discount")} />
          <Button type="submit">{ui.global.save}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
