"use client";
import { useOrderData } from "@/hooks/api/useOrderData";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";
import { orderTotal } from "@/lib/order-numbers";
import account from "@/app/data/account.json";
import { num2str } from "@/lib/num-words";
import { moneyFormatDigital } from "@/lib/format";
import Image from "next/image";
import options from "@/app/data/options.json";
import { discountNumbers } from "@/lib/item-numbers";

type RequestFormProps = {
  number: string;
  supplier: string;
  date: string;
  signature?: boolean;
};

export function RequestFormContent({
  number,
  supplier,
  date,
  signature,
}: RequestFormProps) {
  const { isLoading, error, data: order } = useOrderData(Number(number));
  const acc = account.finance.data_options.find(
    (option) => option.ipn === supplier
  );
  const isDiscounted =
    order?.items.map((item: Item) => Number(item.discount) > 0).length > 0;

  if (isLoading) return <Loader />;

  return (
    <>
      {order && (
        <div className="p-12 font-mono text-sm">
          {/* Header */}
          <div className="header">
            <div>
              <Image src={options.logo} alt="Logo" width={160} height={40} />
            </div>
          </div>

          {/* Heading */}
          <div className="w-full mt-10">
            <h1 className="text-lg uppercase font-bold m-0">
              {ui.global.order} {ui.global.num} {number}
            </h1>
          </div>

          {/* Order Items Table */}
          <table className="w-full border-collapse mb-8" cellPadding="8">
            <thead>
              <tr className="font-semibold border-t-[3px] border-t-double border-t-black border-b border-b-black">
                <td className="px-4 w-1/12 border-r border-gray-300">
                  {ui.global.num}
                </td>
                <td className="px-4 w-8/12 border-r border-gray-300">
                  {ui.global.product_name}
                </td>
                <td className="px-4 w-1/12 text-right whitespace-nowrap border-r border-gray-300">
                  {ui.global.unit_price}
                </td>
                <td className="px-4 w-0.5/12 text-center whitespace-nowrap border-r border-gray-300">
                  {ui.global.quantity}
                </td>
                {isDiscounted && (
                  <td className="px-4 w-1/12 text-right whitespace-nowrap border-r border-gray-300">
                    {ui.global.price_with_discount}
                  </td>
                )}
                <td className="px-4 w-1/12 text-right whitespace-nowrap">
                  {ui.global.total}, {account.finance.currency_name}
                </td>
              </tr>
            </thead>
            <tbody>
              {order?.items.map((item: Item, index: number) => (
                <tr
                  key={item.id}
                  className="orderline border-b border-gray-300"
                >
                  <td className="px-4 w-1/12 text-center border-r border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-4 w-8/12 border-r border-gray-300">
                    {item.description}
                  </td>
                  <td className="px-4 w-1/12 text-right whitespace-nowrap border-r border-gray-300">
                    {moneyFormatDigital(item.price)}
                  </td>
                  <td className="px-4 w-0.5/12 text-center whitespace-nowrap border-r border-gray-300">
                    {item.quantity}
                  </td>
                  {isDiscounted && (
                    <td className="px-4 w-1/12 text-right whitespace-nowrap border-r border-gray-300">
                      {discountNumbers(item).discountedPriceFormatted}
                    </td>
                  )}
                  <td className="px-4 w-1/12 text-right whitespace-nowrap">
                    {moneyFormatDigital(item.total)}
                  </td>
                </tr>
              ))}

              <tr className="border-t-2 border-t-black font-semibold">
                <td className="px-4 "></td>
                <td className="px-4 "></td>
                <td className="px-4 "></td>
                <td className="px-4"></td>
                {ui.global.discount_percentage && <td className="px-4 "></td>}
                <td className="px-4 text-right">
                  {orderTotal(order).numberDigital}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="hidden" id="sum">
            {orderTotal(order).number}
          </div>

          {/* Order Summary */}
          <div>
            {`${ui.global.order_sum}: `}
            <b>
              {orderTotal(order).numberDigital} {account.finance.currency_name}
            </b>
            <div className="">
              <i>
                {num2str(orderTotal(order).number.toFixed(2)) + " "}(
                {ui.global.total_untaxed})
              </i>
            </div>
          </div>
          <div className="mt-4">
            {ui.global.deadline}: <b>30 {ui.global.dd}</b>{" "}
            {ui.global.from_agreement_date}
          </div>
          <div className="h-12"></div>

          {/* Contact Information */}
          <table className="w-full">
            <tbody>
              <tr>
                <td className="align-top w-1/2">
                  <h3 className="text-sm uppercase font-bold py-2">
                    {ui.global.seller}:
                  </h3>
                  <ul className="list-none pb-4">
                    <li>{acc?.name},</li>
                    <li>
                      {ui.global.tax_id}: {acc?.ipn}
                    </li>
                    <li>
                      {ui.global.address}: {acc?.address}
                    </li>
                    <li>
                      {ui.global.phone}: {acc?.phone}
                    </li>
                  </ul>
                  <h3 className="text-sm uppercase font-bold py-2">
                    {ui.global.payment_details}:
                  </h3>
                  <ul className="list-none p-0">
                    <li>
                      {ui.global.recipient}: {acc?.bank.name}
                    </li>
                    <li>
                      {ui.global.account}: {acc?.bank.account},
                    </li>
                    <li>
                      {ui.global.tax_id}: {acc?.ipn}
                    </li>
                    <li>
                      {acc?.bank.name}, {ui.global.mfo} {acc?.bank.mfo}
                    </li>
                    <li>
                      {ui.global.bank_edrpou}: {acc?.bank.edrpou}
                    </li>
                    <li>
                      {ui.global.payment_purpose}:{" "}
                      {ui.global.payment_purpose_text
                        .replace("{order_number}", order.number)
                        .replace("{order_date}", date)}
                    </li>
                  </ul>
                </td>
                <td className="align-top w-1/2">
                  <h3 className="text-sm uppercase font-bold m-0">
                    {ui.global.buyer || ui.global.customer}:
                  </h3>
                  <ul className="list-none p-0">
                    <li>{order.client}</li>
                    <li></li>
                    <li>{order.address}</li>
                    <li>{order.phone}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="align-top w-1/2 relative">
                  <div className="h-12"></div>
                  <div className="mb-6">{date}</div>
                  {signature && (
                    <div className="">
                      <Image
                        src={acc?.signature || ""}
                        alt="Signature"
                        width={160}
                        height={40}
                        className="mix-blend-multiply absolute top-6 left-0"
                      />
                    </div>
                  )}
                  <div>___________________</div>
                  <div>
                    <span className="ml-9">
                      <i>({ui.global.signature})</i>
                    </span>
                  </div>
                </td>
                <td className="align-top w-1/2">
                  <div className="h-12"></div>
                  <div className="mb-6">{date}</div>
                  <div>___________________</div>
                  <div>
                    <span className="ml-9">
                      <i>({ui.global.signature})</i>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
