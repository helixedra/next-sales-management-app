import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, client, email, phone, address, deadline, prepayment } = body;

    if (!number) {
      return NextResponse.json({ error: "Sale number is required" }, { status: 400 });
    }

    const result = db
      .prepare(
        `UPDATE orders
       SET client = ?, email = ?, phone = ?, address = ?, deadline = ?, prepayment = ?
       WHERE number = ?`
      )
      .run(client, email, phone, address, deadline, prepayment, number);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating sale:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
