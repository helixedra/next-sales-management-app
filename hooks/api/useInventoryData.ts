import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/api/inventoryService";
import { InventoryItem } from "@/app/types/InventoryItem";

// Fetching all inventory data
export function useAllInventoryData() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryService.getAllInventoryData(),
  });
}

// Create a new item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: InventoryItem) => inventoryService.createInventoryItem(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

// Updating an item
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedItem: InventoryItem) => inventoryService.updateInventoryItem(updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}

// Deleting an item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inventoryService.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
