export class CreateOrderDto {
  customerId?: number;

  pickupDate!: string;

  paid!: boolean;

  notes?: string;

  items!: {
    productId: number;

    quantity: number;

    unitPrice: number;
  }[];
}
