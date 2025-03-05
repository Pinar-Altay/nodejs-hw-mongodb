import express from 'express';
import {
  getContacts,
  getContact,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js'; // Multer middleware'ini içe aktar

const router = express.Router();

// Tüm rotalara authenticate middleware'ini uygula
router.use(authenticate);

// Rotalar
router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController)); // Fotoğraf yükleme eklendi
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController)); // Fotoğraf yükleme eklendi
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
