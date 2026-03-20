import cron from "node-cron";
import http from "http";
import logger from "../utils/logger";

const HEALTH_URL = `http://localhost:${process.env.PORT ? process.env.PORT : 5000}/health`;

/**
 * Pings the /health endpoint and logs the result.
 */
const pingHealth = (): void => {
  const startTime = Date.now();

  http
    .get(HEALTH_URL, (res) => {
      const duration = Date.now() - startTime;
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          logger.info(`[HealthCheck] OK — status: ${res.statusCode}, response: ${body.trim()}, duration: ${duration}ms`);
        } else {
          logger.warn(`[HealthCheck] Unexpected status: ${res.statusCode}, body: ${body.trim()}, duration: ${duration}ms`);
        }
      });
    })
    .on("error", (err) => {
      logger.error(`[HealthCheck] Request failed — ${err.message}`);
    });
};

export const startHealthCheckCron = (): void => {
  // Fire once immediately on startup so we know the service is healthy right away
  pingHealth();

  cron.schedule("*/10 * * * *", () => {
    logger.debug("[HealthCheck] Cron triggered — pinging /health");
    pingHealth();
  });

  logger.info("[HealthCheck] Cron scheduler started — pinging /health every 10 minutes");
};
