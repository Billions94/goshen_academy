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

  @Get('/')
  async getCartItems(@CurrentUser() authUser: Student) {
    return this.cartService.getCartItems(authUser);
  }

  @Authorized()
  @Post('/add')
  async addItem(@Body() input: Input<Cart>, @CurrentUser() authUser: Student) {
    return this.cartService.create(input, authUser);
  }

  @Authorized()
  @Post('/purchase')
  async purchaseItems(
    @Body() paymentMethod: string,
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.purchaseItems(authUser, paymentMethod);
  }

  @Authorized()
  @Patch('/update/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() input: Input<Cart>,
    @CurrentUser() authUser: Student
  ) {
    return this.cartService.update(id, input, authUser);
  }

  @Authorized()
  @Delete('/delete/:id')
  async deleteItem(@Param('id') id: string, @CurrentUser() authUser: Student) {
    return this.cartService.deleteById(id, authUser);
  }
}
