import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Order } from "@/app/types/Order";

export async function GET() {
  try {
    const orders = db
      .prepare(
        `SELECT
        orders.id,
        orders.date,
        orders.status,
        orders.number,
        orders.client,
        orders.email,
        orders.phone,
        orders.address,
        orders.delivery,
        orders.deadline,
        orders.prepayment,
        orders.comment,
        json_group_array(
        json_object(
          'id', items.id,
          'created', items.created,
          'description', items.description,
          'quantity', items.quantity,
          'price', items.price,
          'total', items.total,
          'discount', items.discount
        )
        ) AS items
      FROM
        orders
      LEFT JOIN
        items ON orders.number = items.order_number
      GROUP BY
        orders.id
      ORDER BY
        orders.number DESC;`
      )
      .all();

    if (!orders) {
      return NextResponse.json({ error: "Sales not found" }, { status: 404 });
    }

    (orders as Order[]).forEach((order: Order) => {
      if (typeof order.items === "string") {
        order.items = JSON.parse(order.items);
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
