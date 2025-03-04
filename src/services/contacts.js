import Contact from '../db/models/Contact.js';
import createError from 'http-errors';

// Tüm iletişimleri getir (kullanıcıya özel)
export const getAllContacts = async (userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc') => {
  try {
    // Sıralama düzenini belirle (1: artan, -1: azalan)
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Toplam öğe sayısını bul (kullanıcıya özel)
    const totalItems = await Contact.countDocuments({ userId });

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(totalItems / perPage);

    // Önceki ve sonraki sayfa kontrolü
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    // Veritabanından iletişimleri getir (kullanıcıya özel, sayfalandırma ve sıralama uygula)
    const contacts = await Contact.find({ userId })
      .sort(sortOptions) // Sıralama uygula
      .skip((page - 1) * perPage) // Atlanacak öğe sayısı
      .limit(perPage); // Sayfa başına öğe sayısı

    return {
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts, // Mevcut sayfadaki iletişimler
        page, // Mevcut sayfa numarası
        perPage, // Sayfadaki öğe sayısı
        totalItems, // Toplam öğe sayısı
        totalPages, // Toplam sayfa sayısı
        hasPreviousPage, // Önceki sayfa var mı?
        hasNextPage, // Sonraki sayfa var mı?
      },
    };
  } catch (error) {
    console.error('Error while fetching contacts:', error);
    throw error;
  }
};

// Belirli bir iletişimi getir (kullanıcıya özel)
export const getContactById = async (userId, contactId) => {
  try {
    // İletişimi bul (kullanıcıya özel)
    const contact = await Contact.findOne({ _id: contactId, userId });
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

// Yeni bir iletişim oluştur (kullanıcıya özel)
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

// Mevcut bir iletişimi güncelle (kullanıcıya özel)
export const patchContact = async (userId, contactId, updateData) => {
  try {
    // İletişimi bul ve güncelle (kullanıcıya özel)
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId }, // Kullanıcıya özel filtre
      updateData,
      { new: true } // Güncellenmiş belgeyi döndür
    );

    // İletişim bulunamazsa 404 hatası fırlat
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

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

// Mevcut bir iletişimi sil (kullanıcıya özel)
export const deleteContact = async (userId, contactId) => {
  try {
    // İletişimi bul ve sil (kullanıcıya özel)
    const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });

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
