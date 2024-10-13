import dayjs from 'dayjs';
import logger from 'pino';
import pretty from 'pino-pretty';

const Logger = logger(
  {
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  pretty()
);

export default Logger;
