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
import { ErrorMapper } from '../../utils/mapper/errorMapper';
import { Cart } from '../entity/cart.entity';
import { ProductRepository } from '../product/repository/product.repository';
import { CartRepository } from '../repository/cart.repository';
import { CartPurchase, ProductType } from './interface';

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
    if (args?.where?.id) {
      queryBuilder.andWhere('cart."id" = :id', { id: args.where.id });
    }

    if (args?.where?.productName) {
      queryBuilder.andWhere('cart."productName" ILIKE :productName', {
        productName: `%${args.where.productName}%`,
      });
    }
  }

  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<Cart>,
    args?: CartServiceWhereArgs | undefined
  ): void {
    if (args?.order) {
      queryBuilder.orderBy(args?.order?.key || 'quiz.id', args?.order?.value);
    }
  }

  public async create(
    input: Input<Omit<Cart, 'productName'>>,
    authUser: Student
  ): Promise<DataResponse<Cart>> {
    const isCourse = input.product.type === ProductType.COURSE;

    const product = await this.productRepository.findOneOrFail({
      where: {
        [`${isCourse ? 'course' : 'lesson'}`]: {
          id: isCourse
            ? input?.product?.course?.id
            : input?.product?.lesson?.id,
        },
      },
      relations: [isCourse ? 'course' : 'lesson'],
    });

    if (!product) return this.errorMapper.throw('Product not found', 404);
    if (product.stock < input.quantity)
      return this.errorMapper.throw(
        `Not enough stock for product: ${product.type}`
      );

    await this.productRepository.save(product);

    const cartItem = new Cart();
    cartItem.productName = isCourse
      ? `${product?.course?.title}`
      : `${product?.lesson?.name}`;

    cartItem.product = product;
    cartItem.student = authUser;
    cartItem.quantity = input.quantity;

    await this.cartRepository.save(cartItem);
    return { status: 201, data: { cartItem } };
  }

  async getCartItems(student: Student): Promise<Cart[]> {
    return this.cartRepository.find({
      where: {
        student: { id: student.id },
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
      if (item.product.stock < item.quantity) {
        return this.errorMapper.throw(
          `Not enough stock for product: ${item.productName}`
        );
      }

      if (typeof item.product.price === 'string') {
        item.product.price = parseFloat(item.product.price);
      } else {
        item.product.price = item.product.price;
      }

      totalPrice += item.product.price * item.quantity;
    }

    const purchaseDetails: CartPurchase = {
      user: student.email,
      items: cartItems.map((item) => ({
        product: item.productName,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalCost: totalPrice,
      paymentMethod,
      status: 'Success',
    };

    for (const item of cartItems) {
      item.product.stock -= item.quantity;
      item.product.isPurchased = true;

      await this.productRepository.save(item.product);
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
    const cartItem = await this.cartRepository.findOne({
      where: {
        id,
        student: { id: authUser?.id },
      },
    });

    if (!cartItem) return this.errorMapper.throw('Cart item not found', 404);

    cartItem.quantity = input.quantity;
    await this.cartRepository.save(cartItem);
    return { status: 200, data: { cartItem } };
  }
}
