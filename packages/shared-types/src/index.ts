export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
};

export type Order = {
  id: string;
  restaurantId: string;
  tableNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SERVED' | 'CANCELLED';
  totalAmount: number;
  createdAt: Date;
};
