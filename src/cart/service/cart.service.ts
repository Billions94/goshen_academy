import { Inject, Service } from 'typedi';
import { IsNull, SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../auth/interface';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../core/abstract-entity-crud.service';
import { Input } from '../../e-learning/interfaces';
import { DataResponse } from '../../e-learning/interfaces/response';
import { Student } from '../../e-learning/students/entity/student.entity';
import { ProductRepository } from '../../product/repository/product.repository';
import { ProductService } from '../../product/service/product.service';
import { ErrorMapper } from '../../utils/mapper/errorMapper';
import { Cart } from '../entity/cart.entity';
import { CartRepository } from '../repository/cart.repository';
import { CartPurchase } from './interface';

interface CartServiceWhereArgs extends FindArgs<Cart> {}

@Service()
export class CartService extends AbstractEntityCrudService<
  Cart,
  CartServiceWhereArgs
> {
  constructor(
    @Inject()
    private readonly cartRepository: CartRepository,
    @Inject()
    private readonly productRepository: ProductRepository,
    @Inject()
    private readonly productService: ProductService,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {
    super(cartRepository, 'cart', errorMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<Cart>,
    authUser: AuthUser
  ): void {
    if (authUser && authUser.isAdmin) {
      queryBuilder.andWhere('cart."isAdmin" = true');
      return;
    }

    this.errorMapper.throw('Unauthorized access to cart', 403);
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<Cart>,
    args: CartServiceWhereArgs
  ): void {
    if (args.where?.id) {
      queryBuilder.andWhere('cart."id" = :id', { id: args.where.id });
    }

    if (args.where?.product?.productName) {
      queryBuilder.andWhere('cart."productName" ILIKE :productName', {
        productName: `%${args.where.product.productName}%`,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Cart>,
    args?: CartServiceWhereArgs | undefined
  ): void {
    if (args?.order) {
      queryBuilder.orderBy(args.order.key || 'quiz.id', args.order.value);
    }
  }

  public async create(
    input: Input<Omit<Cart, 'productName'>>,
    authUser: Student
  ): Promise<DataResponse<Cart>> {
    const isCourse = 'course' in input.product!;
    const product = await this.productService.findOne(input.product, isCourse);
    const productName = isCourse
      ? `${product?.course?.title}`
      : `${product?.lesson?.name}`;

    if (!product) {
      return this.errorMapper.throw('Product not found', 404);
    }

    if (product.stock < input.quantity)
      return this.errorMapper.throw(
        `Not enough stock for product: ${product.type}s`
      );

    await this.productRepository.save(product);

    let cart = await this.cartRepository.findOne({
      where: {
        student: { id: authUser.id },
        deletedAt: IsNull(),
      },
    });

    if (!cart) {
      cart = await this.cartRepository.save({
        productName,
        product,
        student: authUser,
        quantity: input.quantity,
      });
    } else {
      await this.cartRepository.update(cart.id, {
        product,
        student: authUser,
        quantity: input.quantity + cart.quantity,
        updatedAt: new Date(),
      });

      cart = await this.cartRepository.findOneOrFail({
        where: {
          student: { id: authUser.id },
        },
      });
    }

    return { status: 201, data: { cart } };
  }

  async getCartItems(student: Student): Promise<Cart[]> {
    return this.cartRepository.find({
      where: {
        student: { id: student.id },
        deletedAt: IsNull(),
      },
    });
  }

  async purchaseItems(
    student: Student,
    paymentMethod: string
  ): Promise<DataResponse<CartPurchase>> {
    const cartItems = await this.cartRepository.find({
      where: {
        student: { id: student.id },
        deletedAt: IsNull(),
      },
    });

    if (cartItems.length === 0)
      return this.errorMapper.throw('No items in cart to purchase');

    let totalPrice = 0;

    for (const item of cartItems) {
      if (item.product) {
        if (item.product.stock < item.quantity) {
          return this.errorMapper.throw(
            `Not enough stock for product: ${item.product.productName}`
          );
        }

        if (typeof item.product.price === 'string') {
          item.product.price = parseFloat(item.product.price);
        } else {
          item.product.price = item.product.price;
        }

        totalPrice += item.product.price * item.quantity;
      }
    }

    const purchaseDetails: CartPurchase = {
      email: student.email,
      items: cartItems.map((item) => ({
        product: item.product!,
        quantity: item.quantity,
        price: item.product ? item.product.price : 0,
      })),
      totalCost: totalPrice,
      paymentMethod,
      status: 'Success',
    };

    for (const item of cartItems) {
      if (item.product) {
        item.product.stock -= item.quantity;
        item.product.isPurchased = true;
        item.product.updatedAt = new Date();
        await this.productRepository.save(item.product);
      }
      item.deletedAt = new Date();
    }

    await this.cartRepository.save(cartItems);
    return { status: 201, data: { purchaseDetails } };
  }

  public async update(
    id: string,
    input: Input<Cart>,
    authUser?: AuthUser
  ): Promise<DataResponse<Cart>> {
    const newCart = await this.cartRepository.findOne({
      where: {
        id,
        student: { id: authUser?.id },
      },
    });

    if (!newCart) return this.errorMapper.throw('Cart item not found', 404);

    newCart.quantity = input.quantity;
    await this.cartRepository.save(newCart);
    return { status: 200, data: { newCart } };
  }
}
