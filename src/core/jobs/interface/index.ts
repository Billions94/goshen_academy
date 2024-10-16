import { JobOptions } from 'bull';

export interface JobDataOptions<Entity> extends JobOptions {
  entity: Partial<Entity>;
}
