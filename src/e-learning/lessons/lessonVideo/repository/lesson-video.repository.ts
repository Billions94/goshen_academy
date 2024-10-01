import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { DataBase } from '../../../../db/init';
import { Input } from '../../../interfaces';
import { LessonVideo } from '../entity/lesson-video.entity';

@Service()
export class LessonVideoRepository extends Repository<LessonVideo> {
  constructor() {
    super(LessonVideo, DataBase.dataSource.createEntityManager());
  }

  async getById(id: string): Promise<LessonVideo> {
    return (await this.findOne({ where: { id } })) as LessonVideo;
  }

  async updateById(
    id: string,
    input: Input<LessonVideo>
  ): Promise<LessonVideo> {
    const lessonVideo = await this.getById(id);

    if (lessonVideo) {
      lessonVideo.title = input.title;
      lessonVideo.lesson = input.lesson;
      lessonVideo.url = input.url;
      await this.save(lessonVideo);
    }

    return lessonVideo;
  }
}
