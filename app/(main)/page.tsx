"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Item } from "@/app/types/Item";
import { Order } from "@/app/types/Order";
import statuses from "@/lib/status";
import Status from "@/components/shared/status";
import Loader from "@/components/shared/loader";
import { TopBar } from "@/components/pages/homepage/topbar";
import { orderDates } from "@/lib/order-dates";
import { orderTotal, orderLeft } from "@/lib/order-numbers";
import { useAllOrdersData } from "@/hooks/api/useOrderData";
import ui from "@/app/data/ui.json";

// Styles
import "@/app/styles/homepage.css";

// Constants
const TABLE_HEADERS: { key: keyof typeof ui.sales_table; width: string }[] = [
  { key: "num", width: "w-[2%] max-w-[60px]" },
  { key: "date", width: "w-[5%] hidden md:block" },
  { key: "status", width: "w-[20px] md:w-[5%]" },
  { key: "customer", width: "w-[10%]" },
  { key: "order", width: "w-[35%] hidden md:block" },
  { key: "total", width: "w-[5%]" },
  { key: "left", width: "w-[5%] hidden lg:block" },
  { key: "deadline", width: "w-[5%] hidden xl:block" },
  { key: "days_left", width: "w-[2%] text-center" },
];

const stylingCancel = (status: string) =>
  clsx({
    "line-through opacity-40": status === "canceled",
  });

// Table row component
const OrderRow = ({ order }: { order: Order }) => {
  return (
    <Link href={`/orders/${order.number}`} className="block">
      <div className="TableRow">
        <div className={`w-[2%] max-w-[60px] ${stylingCancel(order.status)}`}>
          {order.number}
        </div>
        <div
          className={`w-[5%] hidden md:block ${stylingCancel(order.status)}`}
        >
          {orderDates(order).dateLocal}
        </div>
        <div className="w-[20px] md:w-[5%]">
          <Status
            status={order.status}
            name={statuses[order.status].name}
            className="opacity-100 no-line-through"
          />
        </div>
        <div className={`w-[10%] cutLine ${stylingCancel(order.status)}`}>
          {order.client}
        </div>
        <div
          className={`w-[35%] hidden md:flex items-center ${stylingCancel(
            order.status
          )}`}
        >
          {order.items.map((item: Item) => (
            <div key={item.id} className="OrderItem" title={item.description}>
              {item.description}
            </div>
          ))}
        </div>
        <div className={`w-[5%] ${stylingCancel(order.status)}`}>
          {orderTotal(order).numberDigital}
        </div>
        <div
          className={`w-[5%] hidden lg:block ${stylingCancel(order.status)}`}
        >
          {orderLeft(order).numberDigital}
        </div>
        <div
          className={`w-[5%] hidden xl:block ${stylingCancel(order.status)}`}
        >
          {orderDates(order).deadlineLocalDate}
        </div>
        <div
          className={`w-[2%] text-center cutLine ${stylingCancel(
            order.status
          )}`}
        >
          {orderDates(order).deadlineDaysLeft}
        </div>
      </div>
    </Link>
  );
};

// Table header component
const TableHeader = () => (
  <div className="TableHeader">
    {TABLE_HEADERS.map(({ key, width }) => (
      <div key={key} className={clsx(width, "cutLine")}>
        {ui.sales_table[key]}
      </div>
    ))}
  </div>
);

// Main page component
export default function OrdersPage() {
  // State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Getting data from API
  const { isLoading, data: orders } = useAllOrdersData();

  // Filtering data
  const filteredOrders = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return orders;

    const queryLower = trimmedQuery.toLowerCase();
    return orders?.filter(
      (order: Order) =>
        order.client?.toLowerCase().includes(queryLower) ||
        order.items.some((item: Item) =>
          item.description?.toLowerCase().includes(queryLower)
        ) ||
        order.number?.toString().includes(trimmedQuery)
    );
  }, [orders, searchQuery]);

  // Search handler with debounce
  const searchHandler = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
  }, []);

  // Clear timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Page title
  useEffect(() => {
    document.title = ui.pages.orders + " - " + ui.pages.site_name;
  }, []);

  // Loader
  if (isLoading) return <Loader />;

  // Getting new order number
  const newSaleNumber = orders && orders.length > 0 ? orders[0].number + 1 : 1;

  return (
    <main>
      <TopBar newSaleNumber={newSaleNumber} searchHandler={searchHandler} />

      <div className="TableContainer p-4">
        <TableHeader />

        <div className="TableBody">
          {filteredOrders?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {ui.global.nothing_found}{" "}
              {searchQuery !== "" ? `"${searchQuery}"` : ""}
            </div>
          ) : (
            filteredOrders?.map((order: Order) => (
              <OrderRow key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
