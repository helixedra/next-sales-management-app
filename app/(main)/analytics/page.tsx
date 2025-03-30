"use client";
import { useEffect } from "react";
import { useAllOrdersData } from "@/hooks/api/useOrderData";
import { Order } from "@/app/types/Order";
import { orderTotal } from "@/lib/order-numbers";
import { moneyFormat } from "@/lib/format";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";

// Types
type YearlySortedOrders = {
  [key: number]: Order[];
};

type GlobalMetrics = {
  totalTurnover: number;
  totalItems: number;
  averageCheck: number;
};

// Helper functions for data processing
const calculateGross = (orders: Order[]): number => {
  return orders.reduce((acc, order) => {
    return acc + orderTotal(order).number;
  }, 0);
};

const itemsCount = (items: Item[]): number =>
  items.reduce((acc, item) => acc + Number(item.quantity), 0);

const calculateGlobalMetrics = (orders: Order[]): GlobalMetrics => {
  const totalTurnover = calculateGross(orders);

  const totalItems = orders.reduce((acc, order) => {
    return acc + itemsCount(order.items);
  }, 0);

  const averageCheck =
    totalItems > 0 ? Math.round(totalTurnover / totalItems) : 0;

  return { totalTurnover, totalItems, averageCheck };
};

const groupOrdersByYear = (orders: Order[]): YearlySortedOrders => {
  return orders.reduce((sorted: YearlySortedOrders, order) => {
    const year = new Date(order.date).getFullYear();

    if (!sorted[year]) {
      sorted[year] = [];
    }

    sorted[year].push(order);
    return sorted;
  }, {});
};

// Component for the yearly bar chart
const YearlyBarChart = ({
  sortedByYear,
}: {
  sortedByYear: YearlySortedOrders;
}) => {
  return (
    <div className="flex justify-around items-end mb-8 h-full">
      {Object.entries(sortedByYear).map(([year, yearData]) => {
        const amount = calculateGross(yearData);
        // Calculate height based on amount, with a minimum height
        const barHeight = Math.max(5, amount / 10000);

        return (
          <div key={year} className="flex flex-col items-center mx-4">
            <div className="font-bold mb-2">{year}</div>
            <div
              className="w-12 bg-black dark:bg-zinc-400 mb-2 transition-all duration-500"
              style={{ height: `${barHeight}px` }}
            ></div>
            <div className="text-sm">{moneyFormat(amount)}</div>
          </div>
        );
      })}
    </div>
  );
};

// Component for metric cards
const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="border border-zinc-400 border-opacity-20 rounded-lg p-6">
      <div className="text-gray-600 mb-2">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

// Main Analytics component
export default function Analytics() {
  const { isLoading, data: orders = [] } = useAllOrdersData();

  const filteredOrders = orders.filter((order) => order.status === "finished");

  useEffect(() => {
    document.title = `${ui.pages.analytics} - ${ui.pages.site_name}`;
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const metrics = calculateGlobalMetrics(filteredOrders);
  const sortedByYear = groupOrdersByYear(filteredOrders);

  return (
    <div className="min-h-screen flex flex-col justify-center absolute top-0 w-full -z-10">
      <main className="container mx-auto px-4 py-8 h-full">
        <YearlyBarChart sortedByYear={sortedByYear} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
          <MetricCard
            label={ui.global.total_turnover}
            value={moneyFormat(metrics.totalTurnover)}
          />
          <MetricCard
            label={ui.global.total_units}
            value={`${metrics.totalItems} шт.`}
          />
          <MetricCard
            label={ui.global.average_check}
            value={moneyFormat(metrics.averageCheck)}
          />
        </div>
      </main>
    </div>
  );
}
