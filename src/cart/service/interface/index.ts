import { FindArgs } from '../../../core/abstract-entity-crud.service';
import { Product } from '../../../product/entity/product.entity';

export interface CartPurchase {
  email: string | null;
  items: CartItem[];
  totalCost: number;
  paymentMethod: string;
  status: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export enum ProductType {
  COURSE = 'Course',
  LESSON = 'Lesson',
}

export type WhereKeys<Entity> = FindArgs<Entity>;
