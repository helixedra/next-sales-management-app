import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  // const { id } = req.query || {};
  const body = await request.json();
  // console.log(request);
  // console.log(body);

  const { id, category, name, thickness, length, width, note } = body;

  // console.log("id", id);
  try {
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = db
      .prepare(
        `UPDATE inventory_items
     SET category = ?, name = ?, thickness = ?, length = ?, width = ?, note = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
      )
      .run(category, name, thickness, length, width, note, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Doesn't updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function putHandler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query || {};

//   if (!id || Array.isArray(id)) {
//     return res.status(400).json({ message: "Невірний ID товару" });
//   }

//   try {
//     const { category, name, thickness, length, width, note } = req.body;

//     if (!category || !name || thickness === undefined || length === undefined || width === undefined) {
//       return res.status(400).json({ message: "Не всі обов'язкові поля заповнені" });
//     }

//     await db.run(
//       `UPDATE inventory_items
//        SET category = ?, name = ?, thickness = ?, length = ?, width = ?, note = ?, updated_at = CURRENT_TIMESTAMP
//        WHERE id = ?`,
//       [category, name, thickness, length, width, note, id]
//     );

//     const updatedItem = await db.get("SELECT * FROM inventory_items WHERE id = ?", [id]);

//     if (!updatedItem) {
//       return res.status(404).json({ message: "Товар не знайдено" });
//     }

//     await db.close();
//     return res.status(200).json(updatedItem);
//   } catch (error) {
//     console.error("Database error:", error);
//     return res.status(500).json({ message: "Помилка при обробці запиту" });
//   }
// }

// export async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query || {};

//   if (!id || Array.isArray(id)) {
//     return res.status(400).json({ message: "Невірний ID товару" });
//   }

//   try {
//     const result = await db.run("DELETE FROM inventory_items WHERE id = ?", [id]);

//     if (result.changes === 0) {
//       return res.status(404).json({ message: "Товар не знайдено" });
//     }

//     await db.close();
//     return res.status(200).json({ message: "Товар успішно видалено" });
//   } catch (error) {
//     console.error("Database error:", error);
//     return res.status(500).json({ message: "Помилка при обробці запиту" });
//   }
// }

// export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE };
