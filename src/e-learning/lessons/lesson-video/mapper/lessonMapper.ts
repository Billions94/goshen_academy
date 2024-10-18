import { Lesson } from '../../lesson/entity/lesson.entity';

export const lessonResponseMapper = (lesson: Lesson): Partial<Lesson> => ({
  id: lesson.id,
  name: lesson.name,
  contents: lesson.contents,
  category: lesson.category,
});
