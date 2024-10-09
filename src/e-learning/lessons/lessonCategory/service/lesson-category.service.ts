import { Student } from 'src/e-learning/students/entity/student.entity';
import { Inject, Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import {
  AbstractEntityCrudService,
  FindArgs,
} from '../../../../core/abstract-entity-crud.service';
import Logger from '../../../../utils/logger/logger';
import { ErrorMapper } from '../../../../utils/mapper/errorMapper';
import { DataResponse } from '../../../interfaces/response';
import { LessonCategory } from '../entity/lesson-category.entity';
import { LessonCategoryInput } from '../interface';
import { LessonCategoryRepository } from '../repository/lesson-category.repository';
import { LessonCategoryServiceInterface } from './interface';

interface LessonCategoryServiceArgs extends FindArgs<LessonCategory> {}

@Service()
export class LessonCategoryService
  extends AbstractEntityCrudService<LessonCategory, LessonCategoryServiceArgs>
  implements LessonCategoryServiceInterface<LessonCategory>
{
  constructor(
    @Inject()
    private readonly lessonCategoryRepository: LessonCategoryRepository,
    @Inject()
    private readonly errorMapper: ErrorMapper
  ) {
    super(lessonCategoryRepository, 'lesson_category', errorMapper);
  }

  protected addAuthorizedUserCondition(
    queryBuilder: SelectQueryBuilder<LessonCategory>,
    authUser: Student
  ): void {
    if (authUser && authUser.isAdmin) {
      queryBuilder.andWhere('lesson_category."isAdmin" = true');
      return;
    }

    throw this.errorMapper.throw('Unauthorized access to lesson category', 403);
  }

  protected addWhereCondition(
    queryBuilder: SelectQueryBuilder<LessonCategory>,
    args?: LessonCategoryServiceArgs
  ): void {
    if (args?.where?.id) {
      queryBuilder.andWhere('lesson_category."id" = :id', {
        id: args.where.id,
      });
    }

    if (args?.where?.name) {
      queryBuilder.andWhere('lesson_category."name" ILIKE :name', {
        name: `%${args.where.name}%`,
      });
    }

    if (args?.where?.description) {
      queryBuilder.andWhere(
        'lesson_category."description" ILIKE :description',
        {
          description: `%${args.where.description}%`,
        }
      );
    }
  }
  protected addOrderByClause(
    queryBuilder: SelectQueryBuilder<LessonCategory>,
    args?: LessonCategoryServiceArgs | undefined
  ): void {
    if (args?.where?.name) {
      queryBuilder.orderBy('lesson_category."name"', 'ASC');
    }
  }

  public async create(
    input: LessonCategoryInput,
    authUser?: Student
  ): Promise<DataResponse<LessonCategory>> {
    try {
      if (!authUser?.isAdmin) {
        return this.errorMapper.throw(
          'Unauthorized access to create lesson category',
          403
        );
      }

      const category = await this.lessonCategoryRepository.save(input);
      const newCategory = { id: category.id };
      return { status: 200, data: { newCategory } };
    } catch ({ message }) {
      Logger.error(message);
      return this.errorMapper.throw(message);
    }
  }

  async getLessonCategories(): Promise<LessonCategory[]> {
    return await this.lessonCategoryRepository.find();
  }

  async update(
    id: string,
    input: LessonCategoryInput,
    authUser?: Student
  ): Promise<DataResponse<LessonCategory>> {
    try {
      if (!authUser) {
        return this.errorMapper.throw(
          'Unauthorized access to lesson category',
          403
        );
      }

      await this.lessonCategoryRepository.update(id, input);
      const category = await this.findById(id);

      return category;
    } catch ({ message }) {
      Logger.error(message);
      return this.errorMapper.throw(message);
    }
  }
}
