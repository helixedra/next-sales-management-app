import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Item } from "@/app/types/Item";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, client, email, phone, address, term, prepayment, comment, orderItems } = body;

    const stmt = db.prepare(
      "INSERT INTO orders (status, number, client, email, phone, address, delivery, deadline, prepayment, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
      "new",
      number,
      client,
      email,
      phone,
      address,
      "",
      term,
      prepayment,
      comment
    );

    const orderStmt = db.prepare(
      "INSERT INTO items (description, quantity, price, order_number, total, discount) VALUES (?, ?, ?, ?, ?, ?)"
    );
    orderItems.forEach((item: Item) => {
      orderStmt.run(
        item.description,
        item.quantity,
        item.price,
        number,
        Number(item.quantity) * Number(item.price),
        Number(item.discount) / 100
      );
    });

    return NextResponse.json({ message: "Sale added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
