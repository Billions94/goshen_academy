import dotenv from 'dotenv';
import ORMConfig from '../data-source';
import Logger from '../utils/logger/logger';
dotenv.config();

export class DataBase {
  public static readonly dataSource = ORMConfig;

  public static async connect(): Promise<void> {
    try {
      if (!DataBase.dataSource.isInitialized) {
        await DataBase.dataSource.initialize();
        Logger.info('Connected to database ✅');
        // await insertStudents(100); //Insert mocked students
      }
    } catch (e) {
      Logger.error(e);
      process.exit(1);
    }
  }
}
