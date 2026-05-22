require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const env = require('./src/config/env');
const logger = require('./src/config/logger');

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
