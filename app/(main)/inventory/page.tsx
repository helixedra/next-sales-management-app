"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/shared/loader";
import { RiAddFill, RiEditFill } from "react-icons/ri";
import ui from "@/app/data/ui.json";
import { InventoryItem } from "@/app/types/InventoryItem";
import {
  useAllInventoryData,
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useUpdateInventoryItem,
} from "@/hooks/api/useInventoryData";
import Filter from "@/components/pages/inventory/filter";
import SelectionPanel from "@/components/pages/inventory/selection-panel";
import EditingDialog from "@/components/pages/inventory/dialogs/editing-dialog";
import ConfirmationDialog from "@/components/pages/inventory/dialogs/confirmation-dialog";

export default function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: inventory, isLoading, isError, refetch } = useAllInventoryData();

  // Data filtering
  const filteredInventory = inventory?.filter((item: InventoryItem) => {
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesSearch = searchTerm
      ? item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter
  const categories = inventory
    ? [...new Set(inventory.map((item: InventoryItem) => item.category))]
    : [];

  // Function to handle item editing
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const initialItemData = {
    id: null,
    category: "",
    name: "",
    thickness: "",
    length: "",
    width: "",
    note: "",
  };

  const handleNewItem = () => {
    setEditingItem(initialItemData);
    setIsDialogOpen(true);
  };

  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  // Function to save changes
  const handleSaveChanges = async () => {
    if (!editingItem) return;

    if (editingItem.id === null) {
      createItem.mutate(editingItem, {
        onSuccess: () => {
          refetch();
          setIsDialogOpen(false);
          setEditingItem(null);
        },
        onError: (error) => {
          console.error("Error creating item:", error);
        },
      });
    } else {
      updateItem.mutate(editingItem, {
        onSuccess: () => {
          refetch();
          setIsDialogOpen(false);
          setEditingItem(null);
        },
        onError: (error) => {
          console.error("Error updating item:", error);
        },
      });
    }
  };

  // Function to handle checkboxes
  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  // Function to select/deselect all items
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredInventory) {
      setSelectedItems(
        filteredInventory
          .map((item: InventoryItem) => item.id)
          .filter((id: number): id is number => id !== null)
      );
    } else {
      setSelectedItems([]);
    }
  };

  // Function to delete selected items
  const { mutateAsync: deleteInventoryItem } = useDeleteInventoryItem();

  const handleDeleteSelected = async () => {
    try {
      // Sequentially delete all selected items
      await Promise.all(selectedItems.map((id) => deleteInventoryItem(id)));
      refetch();
      setSelectedItems([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  return (
    <>
      <div className="topBar flex items-center p-6">
        <Button variant="default" onClick={handleNewItem}>
          <RiAddFill style={{ width: "24px", height: "24px" }} />
          {ui.global.add_line}
        </Button>
      </div>

      <div className="py-8">
        <div className=" p-6">
          <div>
            <Filter
              categories={categories as string[]}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {selectedItems.length > 0 && (
              <SelectionPanel
                selectedItems={selectedItems}
                deleteDialog={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
              />
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500 py-8">{ui.global.error_loading_data}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{filteredInventory?.length || 0} items</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        {filteredInventory && filteredInventory.length > 0 && (
                          <Checkbox
                            checked={
                              filteredInventory.length > 0 &&
                              selectedItems.length === filteredInventory.length
                            }
                            onCheckedChange={handleSelectAll}
                            aria-label={ui.global.select_all}
                          />
                        )}
                      </TableHead>
                      <TableHead>{ui.global.category}</TableHead>
                      <TableHead>{ui.global.name}</TableHead>
                      <TableHead className="text-right">{ui.global.thickness_mm}</TableHead>
                      <TableHead className="text-right">{ui.global.length_mm}</TableHead>
                      <TableHead className="text-right">{ui.global.width_mm}</TableHead>
                      <TableHead>{ui.global.note}</TableHead>
                      <TableHead className="text-right">{ui.global.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory && filteredInventory.length > 0 ? (
                      filteredInventory?.map((item: InventoryItem) => (
                        <TableRow
                          key={item.id ?? undefined}
                          className={
                            item.id !== null && selectedItems.includes(item.id)
                              ? "bg-zinc-100 dark:bg-zinc-900"
                              : ""
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={item.id !== null && selectedItems.includes(item.id)}
                              onCheckedChange={(checked) =>
                                item.id !== null && handleCheckboxChange(item.id, checked === true)
                              }
                              aria-label={`${ui.global.select} ${item.name}`}
                            />
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-medium">{item.name || "-"}</TableCell>
                          <TableCell className="text-right">{item.thickness || "-"}</TableCell>
                          <TableCell className="text-right">{item.length || "-"}</TableCell>
                          <TableCell className="text-right">{item.width || "-"}</TableCell>
                          <TableCell>{item.note || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(item)}
                              title="Edit"
                            >
                              <RiEditFill className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          {ui.global.items_not_found}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
        <EditingDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={() => setIsDialogOpen(!isDialogOpen)}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          handleSaveChanges={handleSaveChanges}
        />

        <ConfirmationDialog
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={() => setIsDeleteDialogOpen(!isDeleteDialogOpen)}
          selectedItems={selectedItems}
          handleDeleteSelected={handleDeleteSelected}
        />
      </div>
    </>
  );
}
