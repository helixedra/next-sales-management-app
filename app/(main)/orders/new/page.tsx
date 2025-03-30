"use client";
import { Suspense } from "react";
import Loader from "@/components/shared/loader";
import NewOrderFrom from "./NewOrderForm";

export default function NewSalePage() {
  return (
    <Suspense fallback={<Loader />}>
      <NewOrderFrom />
    </Suspense>
  );
}
