// Server'dan rotaları taşıdım

import express from 'express';
import {
  getContacts,
  getContact,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

/*
// Rotalar - 1
router.get('/', getContacts); // Tüm iletişimleri getir
router.get('/:contactId', getContact); // Belirli bir iletişimi getir
*/

// Rotalar - 2
// Hata sarıcı ekledik - Adım 2-4
router.get('/', ctrlWrapper(getContacts)); // Tüm iletişimleri getir
router.get('/:contactId', ctrlWrapper(getContact)); // Belirli bir iletişimi getir
// Post rotası ekledik - Adım 3-1
router.post('/', ctrlWrapper(createContactController)); // Yeni bir iletişim oluştur
// Patch rotası ekledik - Adım 4-1
router.patch('/:contactId', ctrlWrapper(patchContactController)); // Mevcut bir iletişimi güncelle
// Delete rotası ekledik - Adım 5-1
router.delete('/:contactId', ctrlWrapper(deleteContactController)); // Mevcut bir iletişimi sil

export default router;

