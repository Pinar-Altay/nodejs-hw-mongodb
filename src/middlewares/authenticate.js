import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const authenticate = async (req, res, next) => {
  try {
    // Authorization başlığını al
    const authHeader = req.headers.authorization;

    // Bearer token formatını kontrol et
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Unauthorized: No token provided');
    }

    // Token'ı al
    const token = authHeader.split(' ')[1];

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Token'ın süresinin dolup dolmadığını kontrol et
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      throw createHttpError(401, 'Access token expired');
    }

    // Kullanıcıyı istek nesnesine ekle
    req.user = { userId: decoded.userId };

    // Sonraki middleware'e geç
    next();
  } catch (error) {
    // Hata durumunda 401 Unauthorized döndür
    next(createHttpError(401, error.message || 'Unauthorized'));
  }
};

export default authenticate;
