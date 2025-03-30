"use client";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import ui from "@/app/data/ui.json";

type Props = {
  selectedItems: any[];
  deleteDialog: () => void;
};

export default function SelectionPanel({ selectedItems, deleteDialog }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 mt-4 mb-4 sm:mt-0 bg-muted p-2 rounded-md">
      <span className="text-sm font-medium">
        {ui.global.selected}: {selectedItems.length}
      </span>
      <Button variant="destructive" size="sm" onClick={deleteDialog}>
        <RiDeleteBinLine className="h-4 w-4 mr-1" />
        {ui.global.delete}
      </Button>
    </div>
  );
}
