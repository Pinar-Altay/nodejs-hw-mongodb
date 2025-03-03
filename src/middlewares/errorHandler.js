// Adım 2-2

const errorHandler = (error, req, res, next) => {
  // Hata durumunu ve mesajını belirle
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  // Yanıtı gönder
  res.status(status).json({
    status,
    message,
    data: error.data || null, // Hata nesnesinden alınan belirli hata mesajı
  });
};

export default errorHandler;
