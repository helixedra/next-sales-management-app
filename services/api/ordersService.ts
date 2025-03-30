import api from "./index";
import axios from "axios";
import { OrderFormData } from "@/app/types/OrderFormData";
import { Order } from "@/app/types/Order";

type OrderData = {
  id: number;
  status?: string;
  number: number;
  comment?: string;
};

export const ordersService = {
  // Get all orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get(`/orders`);
    return response.data;
  },

  // Get information about a specific order
  getOrderById: async (number: number): Promise<any> => {
    const response = await api.get(`/orders/${number}`);
    return response.data;
  },

  // Create a new order
  createOrder: async (data: OrderFormData): Promise<any> => {
    const response = await api.post("/orders/create", data);
    return response.data;
  },

  // Get files related to the order
  getOrderFiles: async (number: number): Promise<any> => {
    const response = await api.get(`/orders/files/${number}`);
    return response.data;
  },

  // Upload files
  uploadFiles: async (formData: any): Promise<any> => {
    const response = await api.post("/orders/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (data: {
    number: number;
    status: string;
  }): Promise<any> => {
    const response = await api.post("/orders/update/status", data);
    return response.data;
  },

  // Update order data
  updateOrder: async (data: OrderData): Promise<any> => {
    const response = await api.post("/orders/update", data);
    return response.data;
  },

  // Update comment
  updateComment: async (data: {
    number: number;
    comment: string;
  }): Promise<any> => {
    const response = await api.post("/orders/update/comment", data);
    return response.data;
  },
};
