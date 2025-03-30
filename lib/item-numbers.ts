import { Item } from "@/app/types/Item";
import { moneyFormatDigital } from "./format";

export function discountNumbers(item: Item) {
  const discountedPrice =
    Number(item.price) - Number(item.price) * Number(item.discount);
  const discountPercentage = Number(item.discount) * 100;
  const discountAmount =
    (Number(item.price) - discountedPrice) * Number(item.quantity);
  return {
    discountedPrice,
    discountPercentage,
    discountAmount,
    discountedPriceFormatted: moneyFormatDigital(discountedPrice),
    discountAmountFormatted: moneyFormatDigital(discountAmount),
  };
}
