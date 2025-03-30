"use client";
import { useEffect } from "react";
import Image from "next/image";
import { RiFileLine } from "react-icons/ri";

export function Files({ data }: { data: any }) {
  return (
    <div className="filesBlock m-6">
      <div className="flex flex-wrap gap-4">
        {data.map((file: any) => (
          <div className="flex flex-col truncate w-16 relative" key={file.id}>
            <a
              href={`${process.env.NEXT_PUBLIC_UPLOADS_PATH + file.filename}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute top-1 right-1 bg-blue-800 text-xs text-white px-2 rounded-lg uppercase">
                {file.filename.split(".")[1]}
              </div>
              <div className="flex flex-col w-16 h-16 bg-zinc-200 rounded-md items-center justify-center">
                {file.filename.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <Image
                    src={`${
                      process.env.NEXT_PUBLIC_UPLOADS_PATH + file.filename
                    }`}
                    alt={file.filename}
                    width={128}
                    height={128}
                    className="object-cover w-16 h-16 rounded-md"
                  />
                ) : (
                  <RiFileLine className="w-8 h-8  text-gray-500" />
                )}
              </div>
              <div className="text-xs mt-2 truncate">{file.filename}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
