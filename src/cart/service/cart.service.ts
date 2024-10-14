import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { AuthUser } from '../../auth/interface';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../core/abstract-entity-crud.service';
import { Input } from '../../e-learning/interfaces';
import { DataResponse } from '../../e-learning/interfaces/response';
import { Student } from '../../e-learning/students/entity/student.entity';
import Logger from '../../utils/logger/logger';
import { ErrorMapper } from '../../utils/mapper/errorMapper';
import { Cart } from '../entity/cart.entity';
import { Product } from '../product/entity/product.entity';
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
    const product = await this.productRepository.findByProductType(
      {
        where: {
          id: input.product.id,
          relations: ['course', 'lesson'],
        },
      },
      input.product.type === ProductType.LESSON
        ? ProductType.LESSON
        : ProductType.COURSE
    );

    if (!product) return this.errorMapper.throw('Product not found', 404);
    if (product.stock < input.quantity)
      return this.errorMapper.throw(
        `Not enough stock for product: ${product.type}`
      );

    product.stock = input.product.stock;
    await this.productRepository.save(product);

    let newProduct: Product | null;
    const cartItem = new Cart();

    if (product.type === ProductType.COURSE && product.course) {
      newProduct = await this.productRepository.save({
        ...product,
        course: { id: product.course.id },
      });
      cartItem.productName = product.course.title;

      Logger.info(`Adding course to cart: ${product.course.title}`);
    } else if (product.type === ProductType.LESSON && product.lesson) {
      newProduct = await this.productRepository.save({
        ...product,
        lesson: { id: product.lesson.id },
      });
      cartItem.productName = product.lesson.name;

      Logger.info(`Adding lesson to cart: ${product.lesson.name}`);
    }

    await this.productRepository.save(newProduct!);

    cartItem.product = product;
    cartItem.quantity = cartItem.quantity++;
    cartItem.student = authUser;

    await this.cartRepository.save(cartItem);
    return { status: 201, data: { cartItem } };
  }

  async getCartItems(student: Student): Promise<Cart[]> {
    return this.cartRepository.find({ where: { student } });
  }

  async purchaseItems(
    student: Student,
    paymentMethod: string
  ): Promise<DataResponse<CartPurchase>> {
    const cartItems = await this.cartRepository.find({ where: { student } });

    if (cartItems.length === 0)
      return this.errorMapper.throw('No items in cart to purchase');

    let totalPrice = 0;

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return this.errorMapper.throw(
          `Not enough stock for product: ${item.productName}`
        );
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

    await this.cartRepository.remove(cartItems);
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
