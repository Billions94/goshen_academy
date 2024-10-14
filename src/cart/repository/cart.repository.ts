import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../db/init';
import { Cart } from '../entity/cart.entity';

@Service()
export class CartRepository extends Repository<Cart> {
  constructor() {
    super(Cart, DataBase.dataSource.createEntityManager());
  }
}
