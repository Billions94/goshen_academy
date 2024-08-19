import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../../db/init';
import { LessonVideo } from '../entity/lessonVideo';
import { LessonVideoInput } from '../interface';

@Service()
export class LessonVideoRepository extends Repository<LessonVideo> {
  constructor() {
    super(LessonVideo, DataBase.dataSource.createEntityManager());
  }

  async getById(id: number): Promise<LessonVideo> {
    return (await this.findOne({ where: { id } })) as LessonVideo;
  }

  async updateById(
    id: number,
    input: LessonVideoInput,
    url: string
  ): Promise<LessonVideo> {
    const lessonVideo = await this.getById(id);

    if (lessonVideo) {
      lessonVideo.title = input.title;
      lessonVideo.lesson = input.lesson;
      lessonVideo.url = url;
      await this.save(lessonVideo);
    }

    return lessonVideo;
  }
}
