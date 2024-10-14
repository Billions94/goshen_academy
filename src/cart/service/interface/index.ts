import { FindArgs } from 'src/core/abstract-entity-crud.service';

export interface CartPurchase {
  user: string | null;
  items: CartItem[];
  totalCost: number;
  paymentMethod: string;
  status: string;
}

interface CartItem {
  product: string;
  quantity: number;
  price: number;
}

export enum ProductType {
  COURSE = 'Course',
  LESSON = 'Lesson',
}

export type WhereKeys<Entity> = FindArgs<Entity>;
