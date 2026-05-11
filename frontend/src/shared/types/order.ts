export interface OrderItem {
  productId: number;

  quantity: number;

  unitPrice: number;
}

export interface CreateOrderPayload {
  customerId: number;

  pickupDate: string;

  paid: boolean;

  notes: string;

  items: OrderItem[];
}
