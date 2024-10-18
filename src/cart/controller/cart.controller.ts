import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Input } from '../../e-learning/interfaces';
import { Student } from '../../e-learning/students/entity/student.entity';
import { Cart } from '../entity/cart.entity';
import { CartService } from '../service/cart.service';

@Service()
@JsonController('/cart')
export class CartController {
  @Inject()
  private readonly cartService: CartService;

  @Get('/items')
  async getCartItems(@CurrentUser() authUser: Student) {
    return this.cartService.getCartItems(authUser);
  }

  @Authorized()
  @Post('/add')
  async addItem(
    @Body() input: Omit<Cart, 'productName'>,
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.create(input, authUser);
  }

  @Authorized()
  @Post('/purchase')
  async purchaseItems(
    @Body() { paymentMethod }: { paymentMethod: string },
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.purchaseItems(authUser, paymentMethod);
  }

  @Authorized()
  @Patch('/update/:cartId')
  async updateItem(
    @Param('cartId') cartId: string,
    @Body() input: Input<Cart>,
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.update(cartId, input, authUser);
  }

  @Authorized()
  @Delete('/delete/:cartId')
  async deleteItem(
    @Param('cartId') cartId: string,
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.deleteById(cartId, authUser);
  }
}
