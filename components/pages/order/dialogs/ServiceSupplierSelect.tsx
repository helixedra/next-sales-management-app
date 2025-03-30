import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormRegister, UseFormSetValue, FieldValues } from "react-hook-form";

type FormValues = {
  supplier: string;
  date: Date;
  signature: boolean;
  number: number;
};

type Supplier = {
  ipn: string;
  name: string;
};

type Props = {
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  options: Supplier[];
};

export default function ServiceSupplierSelect({
  register,
  setValue,
  options,
}: Props) {
  return (
    <RadioGroup
      defaultValue={options[0].ipn}
      onValueChange={(value) => setValue("supplier", value)}
    >
      {options.map((supplier) => (
        <div key={supplier.ipn} className="flex items-center relative">
          <RadioGroupItem
            value={supplier.ipn}
            {...register("supplier", { required: true })}
            className="absolute left-4"
            id={supplier.ipn}
          />
          <Label
            htmlFor={supplier.ipn}
            className="text-lg w-full border border-zinc-200 dark:border-zinc-800 rounded-md py-4 px-4 pl-10 cursor-pointer hover:bg-zinc-100 hover:dark:bg-zinc-800"
          >{`${supplier.name} (${supplier.ipn})`}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
