"use client";
import {
  Textarea,
  Label,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Description } from "@radix-ui/react-dialog";
import { useUpdateComment } from "@/hooks/api/useOrderData";
import { Order } from "@/app/types/Order";
import ui from "@/app/data/ui.json";

type FormValues = {
  number: number;
  comment: string;
};

type Props = {
  dialog: boolean;
  trigger: () => void;
  data: FormValues;
  fetchSalesData: () => void;
};

export function CommentDialog({ dialog, trigger, data, fetchSalesData }: Props) {
  //Form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const mutation = useUpdateComment();

  const onSubmit: SubmitHandler<FormValues> = (formData: FormValues) => {
    mutation.mutate(formData);
    trigger();
    fetchSalesData();
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ui.global.edit_comment}</DialogTitle>
          <Description />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ paddingBottom: "1rem" }}>
            <Label>{ui.global.comment}</Label>
            <Textarea {...register("comment")} />
            {errors.comment && <span>{ui.global.field_required}</span>}
          </div>
          <Button type="submit">{ui.global.save}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
