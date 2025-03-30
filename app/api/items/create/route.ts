import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { order_number, description, quantity, price, discount, total } =
      body;

    const stmt = db
      .prepare(
        'INSERT INTO items (description, quantity, price, order_number, total, discount) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(description, quantity, price, order_number, total, discount);

    return NextResponse.json(
      { message: 'Sale added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
