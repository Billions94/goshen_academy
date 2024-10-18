import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
} from 'routing-controllers';
import { MessageStatus } from 'src/core/abstract-entity-crud.service';
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
    @CurrentUser() authUser: AuthUser,
    @Body() input: Input<Product>
  ): Promise<DataResponse<Product>> {
    return this.productService.create(input, authUser);
  }

  @Get()
  public async getProducts(): Promise<Product[]> {
    return this.productService.findMany();
  }

  @Patch('/productId')
  public async updateProduct(
    @CurrentUser() authUser: AuthUser,
    @Params() productId: string,
    @Body() input: Input<Product>
  ): Promise<DataResponse<Product>> {
    return this.productService.update(productId, input, authUser);
  }

  @Delete('/productId')
  public async deleteProduct(
    @CurrentUser() authUser: AuthUser,
    @Params() productId: string
  ): Promise<MessageStatus> {
    return this.productService.deleteById(productId, authUser);
  }
}
