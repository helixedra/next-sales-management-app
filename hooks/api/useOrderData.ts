import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsService, ordersService } from "@/services";
import { Item } from "@/app/types/Item";
import { Order } from "@/app/types/Order";
import { OrderFormData } from "@/app/types/OrderFormData";

// Fetching all orders data
export function useAllOrdersData() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getAllOrders(),
  });
}
// Fetching order data
export function useOrderData(number: number) {
  return useQuery({
    queryKey: ["orders", number],
    queryFn: () => ordersService.getOrderById(number),
    enabled: !!number, // Query runs only if slug exists
  });
}

// Updating order status
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderFormData) => ordersService.createOrder(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Fetching sale files
export function useOrderFiles(number: number) {
  return useQuery({
    queryKey: ["files", number],
    queryFn: () => ordersService.getOrderFiles(number),
    enabled: !!number,
  });
}

// Updating Order
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Order) => ordersService.updateOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Updating order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { number: number; status: string }) =>
      ordersService.updateOrderStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.number] });
    },
  });
}

// Updating comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { number: number; comment: string }) =>
      ordersService.updateComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.number] });
    },
  });
}

// Updating or create item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Item) => {
      if (!data.id) {
        return itemsService.createItem(data);
      } else {
        return itemsService.updateItem(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Upload files
export function useUploadFiles(number: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ordersService.uploadFiles(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", number] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
