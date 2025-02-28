// MongoDB bağlantısını kurma ve başlatma:

import mongoose from 'mongoose';
import { env } from '../utils/env.js';


const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');
    // MongoDB bağlantısı için gerekli olan kullanıcı adı, şifre, URL ve veritabanı adı alınır.


    if (!user || !pwd || !url || !db) {
      throw new Error('Missing MongoDB environment variables!');
    }
    // Eğer gerekli olan herhangi bir bilgi eksikse bir hata fırlatılır.


    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
    // MongoDB bağlantısını kuran fonksiyon tanımlanır.


    await mongoose.connect(connectionString);
    // MongoDB bağlantısı başarılı bir şekilde kurulduğunda konsola bir mesaj yazdırılır.


    console.log('✅ Mongo connection successfully established!');
  } catch (error) {
    console.error('❌ Error while setting up Mongo connection:', error);
    throw error;
  }
};

export default initMongoConnection;
