import ReportLayout from "../../layout";
import { RequestFormContent } from "./request-content";
import ui from "@/app/data/ui.json";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { number, date } = await searchParams;
  return {
    title: `${ui.global.request_form} ${ui.global.num} ${number} ${ui.global.from} ${date}`,
  };
}

export default async function RequestFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { number, supplier, date, signature } = await searchParams;

  return (
    <ReportLayout>
      <RequestFormContent
        number={number}
        supplier={supplier}
        date={date}
        signature={signature === "true"}
      />
    </ReportLayout>
  );
}
