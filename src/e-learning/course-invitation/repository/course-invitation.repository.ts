import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../db/init';
import { CourseInvitation } from '../entity/course-invitation.entity';

@Service()
export class CourseInvitationRepository extends Repository<CourseInvitation> {
  constructor() {
    super(CourseInvitation, DataBase.dataSource.createEntityManager());
  }
}
