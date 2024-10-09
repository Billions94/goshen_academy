import { MessageStatus } from '../../../../core/abstract-entity-crud.service';
import { DataResponse } from '../../../../e-learning/interfaces/response';

export interface ResultServiceInterface<Entity> {
  createMany(entities: Entity[]): Promise<DataResponse<Entity[]>>;
  deleteMany(entities: Entity[]): Promise<MessageStatus>;
}
