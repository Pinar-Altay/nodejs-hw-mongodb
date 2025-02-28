// HTTP isteklerini yönetme - yanıtları döndürme

import { getAllContacts, getContactById } from '../services/contacts.js';


// Tüm iletişimleri getir
// /contacts
export const getContacts = async (req, res) => {
  try {
    const result = await getAllContacts();
    res.status(result.status).json(result);
  } catch {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
};


// Belirli bir iletişimi getir
// /contacts/:contactId
export const getContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);
    res.status(result.status).json(result);
  } catch {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      data: null,
    });
  }
};


