import { OrderProduct } from './order-product.interface';

export interface Order {
  id: string;
  amount: Amount;
  products: OrderProduct[];
  status: string;
}

interface Amount {
  discount: string;
  paid: string;
  returns: string;
  total: string;
}
