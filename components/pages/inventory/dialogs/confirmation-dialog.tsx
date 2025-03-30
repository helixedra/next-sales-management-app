"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ui from "@/app/data/ui.json";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: () => void;
  selectedItems: any[];
  handleDeleteSelected: () => void;
};

export default function ConfirmationDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedItems,
  handleDeleteSelected,
}: Props) {
  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ui.global.delete_items}</AlertDialogTitle>
          <AlertDialogDescription>
            {ui.global.delete_items_description.replace("{count}", selectedItems.length.toString())}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{ui.global.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSelected}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {ui.global.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
