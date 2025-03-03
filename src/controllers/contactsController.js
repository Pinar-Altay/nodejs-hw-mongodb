// HTTP isteklerini yönetme - yanıtları döndürme

import { getAllContacts, getContactById, createContact, patchContact, deleteContact } from '../services/contacts.js';
// Hata yakalama
import createError from 'http-errors';

// Tüm iletişimleri getir:
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

/*
// Belirli bir iletişimi getir:
// /contacts/:contactId
// aşağıda hata yakalama işlemi yapılmamıştır
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
*/

// Hata yakalama ile belirli bir iletişimi getir:
// Adım 2-5::
export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (result.status === 404) {
      // 404 Not Found hatası fırlat
      throw createError(404, 'Contact not found');
    }

    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};


// Yeni bir iletişim oluştur
// Adım 3-2
export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Name, phoneNumber, and contactType are required');
    }

    // Yeni iletişim verilerini hazırla
    const contactData = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    };

    // Servis fonksiyonunu çağır
    const result = await createContact(contactData);

    // Başarılı yanıtı dön
    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};


// Mevcut bir iletişimi güncelle
// Adım 4-2
export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    // Servis fonksiyonunu çağır
    const result = await patchContact(contactId, updateData);

    // Başarılı yanıtı dön
    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};


// Mevcut bir iletişimi sil
// Adım 5-2
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Servis fonksiyonunu çağır
    const result = await deleteContact(contactId);

    // Başarılı yanıtı dön (204 No Content)
    res.status(result.status).send();
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};
