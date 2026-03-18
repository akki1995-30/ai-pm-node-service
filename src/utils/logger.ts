const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg: string, meta?: object) => {
    console.log(`[INFO]  ${timestamp()} ${msg}`, meta ? JSON.stringify(meta) : "");
  },
  warn: (msg: string, meta?: object) => {
    console.warn(`[WARN]  ${timestamp()} ${msg}`, meta ? JSON.stringify(meta) : "");
  },
  error: (msg: string, meta?: object) => {
    console.error(`[ERROR] ${timestamp()} ${msg}`, meta ? JSON.stringify(meta) : "");
  },
  debug: (msg: string, meta?: object) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${timestamp()} ${msg}`, meta ? JSON.stringify(meta) : "");
    }
  },
};

export default logger;
