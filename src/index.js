// Uygulama başlangıç noktası:

import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('❌ Failed to start the server due to database connection error:', error);
    process.exit(1);
  }
};

bootstrap();

