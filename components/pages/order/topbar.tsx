"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  RiBillLine,
  RiReceiptLine,
  RiMoneyDollarBoxLine,
  RiChatNewLine,
  RiUploadCloud2Line,
  RiCircleFill,
} from "react-icons/ri";
import moment from "moment";
import ui from "@/app/data/ui.json";
import statuses from "@/lib/status";
import { Order } from "@/app/types/Order";

type Props = {
  data: Order;
  commentDialog: () => void;
  uploadDialog: () => void;
  handleStatusChange: (status: string) => void;
  invoiceDialog: () => void;
  receiptDialog: () => void;
  requestFormDialog: () => void;
};

export function TopBar({
  data,
  commentDialog,
  uploadDialog,
  handleStatusChange,
  invoiceDialog,
  receiptDialog,
  requestFormDialog,
}: Props) {
  const date = moment(data.date).format("MM/DD/YYYY");
  return (
    <div className="topBar flex p-6 items-center">
      <div className="flex items-center text-4xl mr-6 pr-6 border-r border-1  border-gray-200 dark:border-zinc-700 border-solid">
        <div className="mr-4">
          {ui.global.num} {data.number}
        </div>
        <div className="text-xl opacity-50">{date}</div>
      </div>
      <div className={`status-${data.status} mr-4`}>
        <RiCircleFill />
      </div>
      <div className="ml-2">
        <Select value={data.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px] dark:bg-zinc-800 bg-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-sm p-2">
            <SelectValue className={`status-${data.status}`}>
              {statuses[data.status]?.name || data.status}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ui.status).map((status) => (
              <SelectItem
                key={status}
                value={status}
                className={`status-${status}`}
              >
                {statuses[status].name || status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="actionButtons ml-auto space-x-4">
        {!data.comment && (
          <Button
            onClick={commentDialog}
            variant="outline"
            className="border border-solid text-orange-500 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-white"
          >
            <RiChatNewLine />
            {ui.global.add_comment}
          </Button>
        )}
        <Button onClick={uploadDialog}>
          <RiUploadCloud2Line />
          {ui.global.upload_files}
        </Button>
        <Button onClick={receiptDialog}>
          <RiReceiptLine />
          {ui.global.receipt}
        </Button>
        <Button onClick={requestFormDialog}>
          <RiBillLine />
          {ui.global.request_form}
        </Button>
        <Button onClick={invoiceDialog}>
          <RiMoneyDollarBoxLine />
          {ui.global.invoice}
        </Button>
      </div>
    </div>
  );
}
