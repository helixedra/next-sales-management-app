"use client";
import { useOrderData } from "@/hooks/api/useOrderData";

import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";
import { orderTotal, orderTotalTaxed } from "@/lib/order-numbers";
import account from "@/app/data/account.json";
import { num2str } from "@/lib/num-words";
import { moneyFormatDigital } from "@/lib/format";
import Image from "next/image";

type ReceiptContentProps = {
  number: string;
  supplier: string;
  date: string;
  signature?: boolean;
};

export function ReceiptContent({
  number,
  supplier,
  date,
  signature,
}: ReceiptContentProps) {
  const { isLoading, error, data: order } = useOrderData(Number(number));
  const acc = account.finance.data_options.find(
    (option) => option.ipn === supplier
  );

  isLoading && <Loader />;

  return (
    <>
      {order && (
        <div className="p-12 text-xs leading-tight">
          <h2 className="border-b-2 border-black pb-5 text-lg uppercase">
            {ui.global.expenditure_receipt} {ui.global.num} {number}{" "}
            {ui.global.from} {date}.
          </h2>

          <table className="w-full mt-10">
            <tbody>
              <tr>
                <td className="align-top w-8 p-2">{ui.global.supplier}:</td>
                <td className="align-top p-2">
                  <ul className="list-none p-0 m-0 w-3/5">
                    <li>{`${acc?.name} ${ui.global.tax_id}: ${acc?.ipn}, ${ui.global.address}: ${acc?.address}, ${ui.global.phone}: ${acc?.phone}, ${ui.global.account}: ${acc?.bank.account}, ${ui.global.bank}: ${acc?.bank.name}, ${ui.global.mfo}: ${acc?.bank.mfo}, ${ui.global.edrpou}: ${acc?.bank.edrpou}`}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="align-top p-2">{ui.global.buyer}:</td>
                <td className="align-top p-2">{order.client}</td>
              </tr>
              <tr>
                <td className="align-top p-2">{ui.global.contract}:</td>
                <td className="align-top p-2">
                  {ui.global.num} {number}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full mt-10 border-2 border-black">
            <thead className="bg-gray-200 font-semibold border-b border-black">
              <tr>
                <td className="text-center p-2">{ui.global.num}</td>
                <td className="p-2">{ui.global.product_name}</td>
                <td className="text-right p-2">{ui.global.unit_price}</td>
                <td className="text-right p-2">{ui.global.quantity}</td>
                <td className="text-right p-2">
                  {ui.global.total}, {account.finance.currency_name}
                </td>
              </tr>
            </thead>
            <tbody>
              {order?.items.map((item: Item, index: number) => (
                <tr key={item.id} className="border-b border-black">
                  <td className="text-center orders p-2">{index + 1}</td>
                  <td className="p-2">{item.description}</td>
                  <td className="text-right whitespace-nowrap p-2">
                    {moneyFormatDigital(item.price)}
                  </td>
                  <td className="text-right whitespace-nowrap p-2">
                    {item.quantity}
                  </td>
                  <td className="text-right whitespace-nowrap p-2">
                    {moneyFormatDigital(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="w-full mt-5">
            <tbody>
              <tr className="font-semibold">
                <td className="text-right w-11/12 p-2">{ui.global.total}:</td>
                <td className="text-right w-1/12 p-2">
                  {orderTotal(order).numberDigital}
                </td>
              </tr>
              <tr className="font-semibold">
                <td className="text-right w-11/12 p-2">{ui.global.tax}:</td>
                <td className="text-right w-1/12 p-2">
                  {orderTotalTaxed(order).taxAmountDigital}
                </td>
              </tr>
              <tr className="font-semibold">
                <td className="text-right w-11/12 p-2">
                  {ui.global.total_taxed}:
                </td>
                <td className="text-right w-1/12 p-2">
                  {orderTotalTaxed(order).numberDigital}
                </td>
              </tr>
            </tbody>
          </table>

          <div id="sum" className="hidden"></div>

          <div className="my-6">
            <h4>
              <span className="font-normal">
                {ui.global.overall}:<br />
              </span>
              {num2str(orderTotal(order).number.toFixed(2))} (without VAT)
            </h4>
          </div>

          <table className="w-full">
            <tbody>
              <tr>
                <td className="align-top w-1/2 p-2">
                  <b>{ui.global.supplier_gave}:</b>
                </td>
                <td className="align-top w-1/2 p-2">
                  <b>{ui.global.buyer_received}:</b>
                </td>
              </tr>
              <tr>
                <td className="relative">
                  {signature && (
                    <div className="">
                      <Image
                        src={acc?.signature || ""}
                        alt="Signature"
                        width={160}
                        height={40}
                        className="mix-blend-multiply absolute -top-8 left-0"
                      />
                    </div>
                  )}
                  <div className="font-semibold mt-10">___________________</div>
                  <div>
                    <span className="ml-9 w-1/2">
                      <i>({ui.global.signature})</i>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="font-semibold mt-10">___________________</div>
                  <div>
                    <span className="ml-9 w-1/2">
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
