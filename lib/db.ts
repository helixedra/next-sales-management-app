import Database from "better-sqlite3";

export const db = new Database("sales_db.sqlite");

db.exec(`
CREATE TABLE IF NOT EXISTS "users" (
    "id"	INTEGER,
    "name"	TEXT,
    "email"	TEXT UNIQUE,
    "password"	TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "uploads" (
    "id"	INTEGER,
    "category"	TEXT,
    "number"	INTEGER,
    "filename"	TEXT,
    "timestamp"	INTEGER,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "orders" (
    "id"	INTEGER NOT NULL UNIQUE,
    "date"	timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status"	varchar(255) NOT NULL,
    "number"	int NOT NULL,
    "client"	varchar(255) NOT NULL,
    "email"	varchar(255) NOT NULL,
    "phone"	varchar(255) NOT NULL,
    "address"	varchar(500) NOT NULL,
    "delivery"	varchar(255) NOT NULL,
    "deadline"	int NOT NULL,
    "prepayment"	int NOT NULL,
    "comment"	text NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "items" (
    "id" INTEGER NOT NULL UNIQUE,
    "created" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" text NOT NULL,
    "quantity" int NOT NULL,
    "price" FLOAT NOT NULL,  
    "order_number" int NOT NULL,
    "total" FLOAT NOT NULL,  
    "discount" decimal(10, 2) NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "inventory_items" (
    "id"	INTEGER,
    "category"	TEXT NOT NULL,
    "name"	TEXT NOT NULL,
    "thickness"	REAL NOT NULL,
    "length"	REAL NOT NULL,
    "width"	REAL NOT NULL,
    "note"	TEXT,
    "created_at"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT)
);
`);

const userCount = (
  db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number }
).count;

if (userCount === 0) {
  db.prepare(
    `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `
  ).run(
    "admin",
    "admin@example.com",
    "$2b$10$wz5L/MFzT2yT5tGCr4qV6O9Pgbf4XeWEGwPuPN8QEKkyo16qQoSmq" // hashed password for "admin"
  );
}
