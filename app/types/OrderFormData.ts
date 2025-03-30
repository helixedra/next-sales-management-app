export type OrderFormData = {
  id: number;
  date: string;
  status: string;
  phone: string;
  number: string | null;
  client: string;
  email: string;
  address: string;
  term: string;
  prepayment: string;
  comment: string;
  orderItems: {
    id: number;
    description: string;
    quantity: string;
    price: string;
    discount: string;
  }[];
};
