// Veritabanı ve iş mantığı işlemleri - controllers'a veri sağlama

import Contact from '../db/models/Contact.js';
import createError from 'http-errors';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Tüm iletişimleri getir
    return {
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    };
  } catch (error) {
    console.error('Error while fetching contacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId); // ID'ye göre iletişimi bul
    if (!contact) {
      return {
        status: 404,
        message: 'Contact not found',
        data: null,
      };
    }
    return {
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    };
  } catch (error) {
    console.error('Error while fetching contact:', error);
    throw error;
  }
};

// Yeni bir iletişim oluştur
// Adım 3-3
export const createContact = async (contactData) => {
  try {
    // Yeni iletişimi oluştur ve veritabanına kaydet
    const newContact = await Contact.create(contactData);

    return {
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    };
  } catch (error) {
    console.error('Error while creating contact:', error);
    throw error;
  }
};

// Mevcut bir iletişimi güncelle
// Adım 4-3
export const patchContact = async (contactId, updateData) => {
  try {
    // İletişimi bul ve güncelle
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true } // Güncellenmiş belgeyi döndür
    );

    // İletişim bulunamazsa 404 hatası fırlat
    // Adım 4-5
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    // Adım 4-4
    return {
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    };
  } catch (error) {
    console.error('Error while patching contact:', error);
    throw error;
  }
};


// Mevcut bir iletişimi sil
// Adım 5-3
export const deleteContact = async (contactId) => {
  try {
    // İletişimi bul ve sil
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    // İletişim bulunamazsa 404 hatası fırlat
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }

    // Başarılı yanıt (204 No Content)
    return {
      status: 204,
      message: 'Successfully deleted a contact!',
      data: null,
    };
  } catch (error) {
    console.error('Error while deleting contact:', error);
    throw error;
  }
};


