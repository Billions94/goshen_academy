import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthUser } from '../../auth/interface';
import { Input } from '../../e-learning/interfaces';
import { DataResponse } from '../../e-learning/interfaces/response';
import { Product } from '../entity/product.entity';
import { ProductService } from '../service/product.service';

@Service()
@JsonController('/products')
export class ProductController {
  @Inject()
  private readonly productService: ProductService;

  @Post('/add')
  public async createProduct(
    @Body() input: Input<Product>,
    @CurrentUser() authUser: AuthUser
  ): Promise<DataResponse<Product>> {
    return this.productService.create(input, authUser);
  }

  @Get()
  public async getProducts(): Promise<Product[]> {
    return this.productService.findMany();
  }
}
