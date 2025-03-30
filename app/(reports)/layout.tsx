"use client";
import { ReactNode } from "react";
import "@/app/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ReportLayout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className="min-h-screen p-8">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
