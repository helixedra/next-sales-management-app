import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Order } from "@/app/types/Order";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  if (!number) {
    return NextResponse.json(
      { error: "Sale number is required" },
      { status: 400 }
    );
  }

  try {
    const order = db
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
          CASE
            WHEN COUNT(items.id) = 0 THEN '[]'
            ELSE json_group_array(
              json_object(
                'id', items.id,
                'created', items.created,
                'description', items.description,
                'quantity', items.quantity,
                'price', items.price,
                'total', items.total,
                'discount', items.discount
              )
            )
          END AS items
        FROM
          orders
        LEFT JOIN
          items ON orders.number = items.order_number
        WHERE
          orders.number = ?
        GROUP BY
          orders.id, orders.date, orders.status, orders.number, orders.client, orders.email, orders.phone, 
          orders.address, orders.delivery, orders.deadline, orders.prepayment, orders.comment`
      )
      .get(number);

    if (!order) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    // If items is returned as a JSON string, parse it
    if (typeof (order as Order).items === "string") {
      (order as Order).items = JSON.parse(
        (order as Order).items as unknown as string
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
