import api from "./index";

export const inventoryService = {
  // Create a new item
  getAllInventoryData: async () => {
    const response = await api.get("/inventory");
    return response.data;
  },

  // Create a new item
  createInventoryItem: async (newItem: any) => {
    const response = await api.post("/inventory/create", newItem);
    return response.data;
  },

  // Update an item
  updateInventoryItem: async (updatedItem: any) => {
    const response = await api.put("/inventory/update", updatedItem);
    return response.data;
  },

  // Delete an item
  deleteInventoryItem: async (id: number) => {
    const response = await api.delete(`/inventory/delete/${id}`);
    return response.data;
  },
};
