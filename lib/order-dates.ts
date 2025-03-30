import moment from "moment";
import { Order } from "@/app/types/Order";

type OrderDates = {
  dateLocal: string;
  deadlineLocalDate: string;
  deadlineDaysLeft: number;
};

export const orderDates = (order: Order): OrderDates => {
  const date = moment(order.date);
  const dateLocal = date.format("MM/DD/YYYY");
  const deadlineDate = moment(order.date).add(Number(order.deadline), "days");
  const deadlineLocalDate = deadlineDate.format("MM/DD/YYYY");
  const deadlineDaysDiff = deadlineDate.diff(moment(), "days");
  const deadlineDaysLeft = deadlineDaysDiff < 0 ? 0 : deadlineDaysDiff;

  return {
    dateLocal,
    deadlineLocalDate,
    deadlineDaysLeft,
  };
};
