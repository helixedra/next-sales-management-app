"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label } from "@/components/ui";
import ui from "@/app/data/ui.json";
import type { InventoryItem } from "@/app/types/InventoryItem";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: () => void;
  editingItem: InventoryItem | null;
  setEditingItem: (item: InventoryItem) => void;
  handleSaveChanges: () => void;
};

export default function EditingDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingItem,
  setEditingItem,
  handleSaveChanges,
}: Props) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{ui.global.edit_item}</DialogTitle>
          <DialogDescription>{ui.global.edit_item_description}</DialogDescription>
        </DialogHeader>

        {editingItem && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                {ui.global.category}
              </Label>
              <Input
                id="category"
                value={editingItem.category || ""}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {ui.global.name}
              </Label>
              <Input
                id="name"
                value={editingItem.name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thickness" className="text-right">
                {ui.global.thickness_mm}
              </Label>
              <Input
                id="thickness"
                value={editingItem.thickness || ""}
                onChange={(e) => setEditingItem({ ...editingItem, thickness: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="length" className="text-right">
                {ui.global.length_mm}
              </Label>
              <Input
                id="length"
                value={editingItem.length || ""}
                onChange={(e) => setEditingItem({ ...editingItem, length: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="width" className="text-right">
                {ui.global.width_mm}
              </Label>
              <Input
                id="width"
                value={editingItem.width || ""}
                onChange={(e) => setEditingItem({ ...editingItem, width: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                {ui.global.note}
              </Label>
              <Input
                id="note"
                value={editingItem.note || ""}
                onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value || null })}
                className="col-span-3"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={setIsDialogOpen}>
            {ui.global.cancel}
          </Button>
          <Button onClick={handleSaveChanges}>{ui.global.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
