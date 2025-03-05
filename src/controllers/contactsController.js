// HTTP isteklerini yönetme - yanıtları döndürme
import { getAllContacts, getContactById, createContact, patchContact, deleteContact } from '../services/contacts.js';
// Hata yakalama
import createError from 'http-errors';

// Tüm iletişimleri getir
export const getContacts = async (req, res, next) => {
  try {
    const { userId } = req.user; // Kullanıcı ID'sini al
    // Sorgu parametrelerini al
    const page = parseInt(req.query.page) || 1; // Varsayılan sayfa: 1
    const perPage = parseInt(req.query.perPage) || 10; // Varsayılan öğe sayısı: 10
    const sortBy = req.query.sortBy || 'name'; // Varsayılan sıralama özelliği: name
    const sortOrder = req.query.sortOrder || 'asc'; // Varsayılan sıralama düzeni: asc
    // Servis fonksiyonunu çağır (kullanıcı ID'sini ekleyin)
    const result = await getAllContacts(userId, page, perPage, sortBy, sortOrder);
    // Başarılı yanıtı dön
    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};

// Belirli bir iletişimi getir
export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { userId } = req.user; // Kullanıcı ID'sini al
    // Servis fonksiyonunu çağır (kullanıcı ID'sini ekleyin)
    const result = await getContactById(userId, contactId);
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
export const createContactController = async (req, res, next) => {
  try {
    const { userId } = req.user; // Kullanıcı ID'sini al
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file ? req.file.path : null; // Cloudinary'den gelen fotoğraf URL'si

    // Zorunlu alanları kontrol et
    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Name, phoneNumber, and contactType are required');
    }

    // Yeni iletişim verilerini hazırla (userId ve photo ekleyin)
    const contactData = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
      photo, // Cloudinary'den gelen fotoğraf URL'si
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
export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { userId } = req.user; // Kullanıcı ID'sini al
    const updateData = req.body;
    const photo = req.file ? req.file.path : null; // Cloudinary'den gelen fotoğraf URL'si

    // Eğer fotoğraf yüklendiyse, updateData'ya ekle
    if (photo) {
      updateData.photo = photo;
    }

    // Servis fonksiyonunu çağır (kullanıcı ID'sini ekleyin)
    const result = await patchContact(userId, contactId, updateData);

    // Başarılı yanıtı dön
    res.status(result.status).json(result);
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};

// Mevcut bir iletişimi sil
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { userId } = req.user; // Kullanıcı ID'sini al
    // Servis fonksiyonunu çağır (kullanıcı ID'sini ekleyin)
    const result = await deleteContact(userId, contactId);
    // Başarılı yanıtı dön (204 No Content)
    res.status(result.status).send();
  } catch (error) {
    next(error); // Hata yakalandığında errorHandler'a ilet
  }
};
