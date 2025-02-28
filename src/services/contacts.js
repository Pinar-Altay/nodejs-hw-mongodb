// Veritabanı ve iş mantığı işlemleri - controllers'a veri sağlama

import Contact from '../db/models/Contact.js';

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



