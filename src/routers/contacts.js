

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

const router = express.Router();


// Rotalar

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.get('/:contactId', ctrlWrapper(getContact));

router.post('/', ctrlWrapper(createContactController));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', ctrlWrapper(patchContactController));
router.patch('/:contactId', validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));


export default router;

