"use client";
import { useEffect } from "react";
import { useAllOrdersData } from "@/hooks/api/useOrderData";
import { Order } from "@/app/types/Order";
import { orderTotal } from "@/lib/order-numbers";
import { moneyFormat } from "@/lib/format";
import Loader from "@/components/shared/loader";
import ui from "@/app/data/ui.json";
import { Item } from "@/app/types/Item";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  LabelList,
} from "recharts";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { log } from "console";
const chartData = [
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 255, mobile: 180 },
  { month: "May", desktop: 290, mobile: 210 },
  { month: "June", desktop: 320, mobile: 240 },
  { month: "July", desktop: 340, mobile: 270 },
  { month: "August", desktop: 310, mobile: 250 },
  { month: "September", desktop: 370, mobile: 300 },
  { month: "October", desktop: 390, mobile: 330 },
  { month: "November", desktop: 420, mobile: 380 },
  { month: "December", desktop: 480, mobile: 450 },
  { month: "January", desktop: 350, mobile: 280 },
  { month: "February", desktop: 330, mobile: 260 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "rgb(255, 255, 255)",
  },
  mobile: {
    label: "Mobile",
    color: "rgb(155, 155, 105)",
  },
} satisfies ChartConfig;

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
    <Card className="border-zinc-200 dark:border-zinc-800 bg-transparent w-full">
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>
          Showing total visitors for the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-fit w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date(
                new Date().setMonth(new Date().getMonth() - 12)
              ).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
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

export function BarChartComponent({
  yearData,
}: {
  yearData: YearlySortedOrders;
}) {
  // Calculate gross revenue for each year
  const yearlyData = Object.entries(yearData).map(([year, orders]) => ({
    year,
    gross: calculateGross(orders).toFixed(2),
  }));

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-transparent w-full">
      <CardHeader>
        <CardTitle>Yearly Revenue</CardTitle>
        <CardDescription>Overview of yearly revenue trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-fit w-full">
          <BarChart
            accessibilityLayer
            data={yearlyData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="gross" radius={8} fill="url(#gradientDesktop)">
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <defs>
              <linearGradient id="gradientDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Yearly revenue trends <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on finished orders
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards({
  totalRevenue,
  totalItems,
  avaregeCheck,
}: {
  totalRevenue: string;
  totalItems: number;
  avaregeCheck: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      <Card className="bg-transparent">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalRevenue}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Revenue growth is stable</div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent">
        <CardHeader className="relative">
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalItems} pcs.
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent">
        <CardHeader className="relative">
          <CardDescription>Check Average</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {avaregeCheck}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Check average is improving <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="bg-transparent">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}

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
    <div className="pt-4">
      <main className="flex flex-col gap-4 justify-between items-center px-4 h-fit">
        <SectionCards
          totalRevenue={moneyFormat(metrics.totalTurnover)}
          totalItems={metrics.totalItems}
          avaregeCheck={moneyFormat(metrics.averageCheck)}
        />
        <div className="flex items-center gap-4 w-full">
          <YearlyBarChart sortedByYear={sortedByYear} />
          <BarChartComponent yearData={sortedByYear} />
        </div>
      </main>
    </div>
  );
}
