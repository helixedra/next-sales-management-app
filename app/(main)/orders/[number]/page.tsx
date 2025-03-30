"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RiMessage2Fill, RiEditFill } from "react-icons/ri";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";
import Loader from "@/components/shared/loader";
import {
  OrderDialog,
  ItemDialog,
  CommentDialog,
  UploadDialog,
} from "@/components/pages/order/dialogs";
import { Files, Items, TopBar } from "@/components/pages/order";
import { orderDates } from "@/lib/order-dates";
import { orderTotal, orderLeft } from "@/lib/order-numbers";
import { moneyFormat } from "@/lib/format";
import {
  useOrderData,
  useOrderFiles,
  useUpdateOrderStatus,
} from "@/hooks/api/useOrderData";
import ErrorComponent from "@/components/shared/error";
import { ReceiptDialog } from "@/components/pages/order/dialogs/receipt-dialog";
import { RequestFormDialog } from "@/components/pages/order/dialogs/request-dialog";
import { InvoiceDialog } from "@/components/pages/order/dialogs/invoice-dialog";

export default function OrderPage() {
  const queryClient = useQueryClient();
  const { number } = useParams();
  const [itemInEdit, setItemInEdit] = useState<Item | null>(null);

  const [dialogs, setDialogs] = useState({
    orderEdit: false,
    itemEdit: false,
    comment: false,
    upload: false,
    invoice: false,
    requestForm: false,
    receipt: false,
  });

  // Get order data
  const { isLoading, error, data: order } = useOrderData(Number(number));

  // Page title
  useEffect(() => {
    if (order) {
      document.title = `${ui.pages.order} ${ui.global.num}${order.number} - ${ui.pages.site_name}`;
    }
  }, [order]);

  // Get attached files list
  const updateStatusMutation = useUpdateOrderStatus();

  const {
    isLoading: isFilesLoading,
    error: filesError,
    data: files,
  } = useOrderFiles(Number(number));

  const toggleDialog = (name: string, value: boolean) => {
    setDialogs((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading || isFilesLoading) {
    return <Loader />;
  }

  if (error) return <ErrorComponent message={error.message} />;
  if (filesError) return <ErrorComponent message={filesError.message} />;

  if (!order) {
    return <div className="mx-auto my-auto">{ui.global.nothing_found}</div>;
  }

  const newItemState = {
    id: null,
    description: "",
    quantity: 1,
    price: "",
    discount: 0,
    total: 0,
    _discount: 0,
    order_number: order.number,
  };

  function handleOrderEditData(id: number) {
    if (id === 0) {
      setItemInEdit(newItemState);
    } else {
      setItemInEdit(order.items.find((item: Item) => item.id === id) || null);
    }
    toggleDialog("itemEdit", !dialogs.itemEdit);
  }

  const handleStatusChange = (status: any) => {
    updateStatusMutation.mutate({ status, number: order.number });
  };

  return (
    <div>
      <TopBar
        data={order}
        commentDialog={() => toggleDialog("comment", !dialogs.comment)}
        uploadDialog={() => toggleDialog("upload", !dialogs.upload)}
        invoiceDialog={() => toggleDialog("invoice", !dialogs.invoice)}
        receiptDialog={() => toggleDialog("receipt", !dialogs.receipt)}
        requestFormDialog={() =>
          toggleDialog("requestForm", !dialogs.requestForm)
        }
        handleStatusChange={handleStatusChange}
      />

      <div className="orderInfo justify-between border border-zinc-200 dark:border-zinc-800 rounded-sm px-6 m-6">
        <div className="w-full flex text-left py-6 text-default dark:text-zinc-600 text-sm items-center relative">
          <div className="cutLine px-1 w-2/12 truncate">
            {ui.global.customer}
          </div>
          <div className="cutLine px-1 w-1/12">{ui.global.phone}</div>
          {order.email && (
            <div className="px-1 w-1/12 truncate">{ui.global.email}</div>
          )}
          <div className="cutLine px-1 flex-grow">{ui.global.address}</div>
          <div className="cutLine px-1 w-1/12">{ui.global.order_sum}</div>
          <div className="cutLine px-1 w-1/12">{ui.global.paid}</div>
          <div className="cutLine px-1 w-1/12">{ui.global.left}</div>
          <div className="cutLine px-1 w-1/12 flex items-center justify-between">
            {ui.global.deadline}
          </div>
          <div className="flex px-1 justify-end absolute -right-2 top-4">
            <Button
              variant={"outline"}
              className="flex ml-auto text-black dark:text-white"
              onClick={() => toggleDialog("orderEdit", !dialogs.orderEdit)}
            >
              <RiEditFill />
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-left py-6 border-t border-zinc-200 dark:border-zinc-800 divide-zinc-200 dark:divide-zinc-800">
          <div className="w-2/12 px-1 break-all">{order.client}</div>
          <div className="w-1/12 px-1 truncate">{order.phone}</div>
          {order.email && (
            <div className="w-1/12 px-1 truncate">{order.email}</div>
          )}
          <div className="flex-grow px-1 truncate">{order.address}</div>
          <div className="w-1/12 px-1">{orderTotal(order).currencyString}</div>
          <div className="w-1/12 px-1">{moneyFormat(order.prepayment)}</div>
          <div
            className={
              orderLeft(order).number > 0
                ? "text-red-500 w-1/12 px-1"
                : "w-1/12 px-1"
            }
          >
            {orderLeft(order).currencyString}
          </div>
          <div className="w-1/12 px-1">
            {orderDates(order).deadlineLocalDate}
            <span className="text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1 ml-2 rounded-sm">
              {orderDates(order).deadlineDaysLeft}
            </span>
          </div>
        </div>
      </div>

      {files && files.length > 0 && <Files data={files} />}

      {order.comment && (
        <div className="commentBlock p-6 bg-orange-100 dark:bg-orange-950 text-orange-950 dark:text-orange-300 m-6 rounded-sm">
          <div className="flex min-h-10 justify-center">
            <div className="text-orange-400 p-2 rounded-t-sm">
              <RiMessage2Fill style={{ width: "24px", height: "24px" }} />
            </div>
            <div
              style={{ whiteSpace: "pre-line" }}
              className="flex px-4 items-center flex-1"
            >
              {order.comment.replace(/\\r\\n/g, "\r\n")}
            </div>
            <Button
              variant={"ghost"}
              className="bg-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white dark:bg-opacity-15 dark:bg-orange-900 dark:text-orange-200"
              onClick={() => toggleDialog("comment", !dialogs.comment)}
            >
              <RiEditFill />
            </Button>
          </div>
        </div>
      )}

      <Items data={order} handler={handleOrderEditData} />

      <OrderDialog
        dialog={dialogs.orderEdit}
        trigger={() => toggleDialog("orderEdit", !dialogs.orderEdit)}
        data={order}
        fetchSalesData={() =>
          queryClient.invalidateQueries({ queryKey: ["orders", number] })
        }
      />
      <ItemDialog
        saleNumber={order.number}
        dialog={dialogs.itemEdit}
        trigger={() => toggleDialog("itemEdit", !dialogs.itemEdit)}
        data={itemInEdit}
        fetchSalesData={() =>
          queryClient.invalidateQueries({ queryKey: ["orders", number] })
        }
      />
      <CommentDialog
        dialog={dialogs.comment}
        trigger={() => toggleDialog("comment", !dialogs.comment)}
        data={{ number: order.number, comment: order.comment }}
        fetchSalesData={() =>
          queryClient.invalidateQueries({ queryKey: ["orders", number] })
        }
      />
      <UploadDialog
        dialog={dialogs.upload}
        trigger={() => toggleDialog("upload", !dialogs.upload)}
        number={order.number}
        fetchSalesData={() =>
          queryClient.invalidateQueries({ queryKey: ["files", number] })
        }
      />
      <ReceiptDialog
        dialog={dialogs.receipt}
        trigger={() => toggleDialog("receipt", !dialogs.receipt)}
        number={order.number}
      />
      <InvoiceDialog
        dialog={dialogs.invoice}
        trigger={() => toggleDialog("invoice", !dialogs.invoice)}
        number={order.number}
      />
      <RequestFormDialog
        dialog={dialogs.requestForm}
        trigger={() => toggleDialog("requestForm", !dialogs.requestForm)}
        number={order.number}
      />
    </div>
  );
}
