// Sunucu ayarlama ve başlatma:


import express from 'express';
import cors from 'cors';
import pino from 'pino';
import cookieParser from 'cookie-parser';
/* import { getContacts, getContact } from './controllers/contactsController.js'; */
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; // Yeni eklenen satır
// Hata Yönetimi Middleware'ini içe aktar:
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const setupServer = () => {
  const app = express();

  // Middleware'ler
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());


  // Logger
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  /*
  // Rotalar
  // Bu kısmı routers klasörüne taşıdık!
  app.get('/contacts', getContacts); // Tüm iletişimleri getir
  app.get('/contacts/:contactId', getContact); // Belirli bir iletişimi getir
  */

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);


  // Hata Yönetimi Middleware'ini uygula:
  // Adım 2-2 ve 2-3
  app.use(notFoundHandler);
  app.use(errorHandler);


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
