// Sunucu ayarlama ve başlatma:


import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getContacts, getContact } from './controllers/contactsController.js';

const setupServer = () => {
  const app = express();

  // Middleware'ler
  app.use(cors());
  app.use(express.json());

  // Logger
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Rotalar
  app.get('/contacts', getContacts); // Tüm iletişimleri getir
  app.get('/contacts/:contactId', getContact); // Belirli bir iletişimi getir

  // 404 Hatası
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Sunucuyu başlat
  const PORT = process.env.PORT || 3000;
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
