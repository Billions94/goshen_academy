import { DataSource } from 'typeorm';
import ORMConfig from '../ormConfig';
import Logger from '../utils/logger/logger';

export class DataBase {
  public static readonly dataSource = new DataSource(ORMConfig);

  public static async connect(): Promise<void> {
    try {
      if (!DataBase.dataSource.isInitialized) {
        await DataBase.dataSource.initialize();
        await DataBase.dataSource.synchronize();
        Logger.info('Connected to database ✅');
      }
    } catch ({ message }) {
      Logger.error(message);
      process.exit(1);
    }
  }
}
