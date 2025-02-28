// Yardımcı bir fonksiyon olan env fonksiyonu, process.env içerisindeki bir anahtarı alır ve değerini döndürür.
// Eğer anahtar bulunamazsa varsayılan değeri döndürür.

import 'dotenv/config';

export const env = (key, defaultValue = null) => {
  return process.env[key] || defaultValue;
};
