import ReportLayout from "../../layout";
import { InvoiceContent } from "./invoice-content";

import ui from "@/app/data/ui.json";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { number, date } = resolvedSearchParams;
  return {
    title: `${ui.global.invoice} ${ui.global.num} ${number} ${ui.global.from} ${date}`,
  };
}

export default async function InvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { number, supplier, date } = resolvedSearchParams;

  return (
    <ReportLayout>
      <InvoiceContent number={number} supplier={supplier} date={date} />
    </ReportLayout>
  );
}
