import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntry } from '../../../core/base/base-time-entry';
import { Course } from '../../../e-learning/course/entity/course.entity';

@Index('IDX_Course_Invitation_tb', ['id'], { unique: true })
@Entity('course_invitation')
export class CourseInvitation extends BaseTimeEntry {
  @Index('Course_Invitation_email', ['email'], { unique: true })
  @Column()
  email: string;

  @Column('boolean', { default: false })
  isSent: boolean;

  @Column('boolean', { default: false })
  isAccepted: boolean;

  @Column('boolean', { default: true })
  isValid: boolean;

  @Column('timestamptz', {
    default: () => `NOW() + INTERVAL '1 hour'`,
    nullable: true,
  })
  expiresAt: Date | null;

  @ManyToOne(() => Course, (course) => course.invitations, {
    eager: true,
    cascade: true,
  })
  @Index('IDX_Quiz_course')
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
