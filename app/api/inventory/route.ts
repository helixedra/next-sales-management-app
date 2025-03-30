import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { InventoryItem } from "@/app/types/InventoryItem";

export async function GET() {
  try {
    const items: InventoryItem[] = db
      .prepare(
        "SELECT id, category, name, thickness, length, width, note FROM inventory_items ORDER BY category, name"
      )
      .all() as InventoryItem[];
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 });
  }
}
