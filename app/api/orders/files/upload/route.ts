import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { db } from "@/lib/db";

if (
  !process.env.NEXT_PUBLIC_R2_ENDPOINT ||
  !process.env.NEXT_PRIVATE_R2_ACCESS_KEY_ID ||
  !process.env.NEXT_PRIVATE_R2_SECRET_ACCESS_KEY
) {
  throw new Error(
    "Missing required environment variables for S3 configuration"
  );
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PRIVATE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PRIVATE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_R2_BUCKET_NAME; // Ім’я bucket із .env

export async function POST(request: Request) {
  console.log("--------------Upload request received");

  try {
    const formData = await request.formData();

    let uploadedFileName = "";
    const file = formData.get("file");
    const imageFromClipboard = formData.get("imageFromClipboard");
    const category = formData.get("category");
    const number = formData.get("number");

    let buffer;
    let contentType = "image/jpeg";

    // Upload file from form data
    if (file instanceof Blob) {
      buffer = Buffer.from(await file.arrayBuffer());
      const extension =
        file instanceof File ? file.name.split(".").pop() : "jpg";
      uploadedFileName = `file-${Date.now()}.${extension}`; // Ім’я файлу без uuid

      if (file.type.startsWith("image/")) {
        buffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
        contentType = "image/jpeg";
      } else {
        contentType = file.type;
      }
    }

    // Upload image from clipboard
    if (typeof imageFromClipboard === "string" && imageFromClipboard) {
      const base64Data = imageFromClipboard.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      );
      uploadedFileName = `clipboard-${Date.now()}.jpg`; // Ім’я файлу без uuid
      buffer = Buffer.from(base64Data, "base64");
      buffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
      contentType = "image/jpeg";
    }

    if (!uploadedFileName || !buffer) {
      return NextResponse.json(
        { error: "No valid file or image found in request" },
        { status: 400 }
      );
    }

    // Upload to R2
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uploadedFileName,
      Body: buffer,
      ContentType: contentType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // URL for the uploaded file // TODO: Replace with custom domain
    const fileUrl = `${process.env.NEXT_PUBLIC_R2_ENDPOINT}/${BUCKET_NAME}/${uploadedFileName}`;

    console.log(uploadedFileName);

    // Save the upload to the database
    const timestamp = Date.now();
    const stmt = db.prepare(
      "INSERT INTO uploads (category, number, filename, timestamp) VALUES (?, ?, ?, ?)"
    );
    stmt.run(category, number, uploadedFileName, timestamp);

    return NextResponse.json({
      message: "Upload successful",
      fileName: uploadedFileName,
      url: fileUrl,
      category,
      number,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
