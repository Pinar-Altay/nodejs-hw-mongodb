import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  newUser.password = undefined;

  return newUser;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshSession = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!decoded) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const oldSession = await Session.findOneAndDelete({ refreshToken });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const newRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  await Session.create({
    userId: decoded.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }
};

// Yeni fonksiyon: Kullanıcıyı e-posta adresine göre bul
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

// Yeni fonksiyon: Şifre sıfırlama e-postası gönder
const sendResetPasswordEmail = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Şifre Sıfırlama İsteği',
      text: `Şifrenizi sıfırlamak için bu bağlantıyı kullanın: ${resetLink}`,
      html: `<p>Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

// Yeni fonksiyon: Token'ı doğrula ve e-posta adresini al
const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};

// Yeni fonksiyon: Şifreyi güncelle
const updatePassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
};

// Yeni fonksiyon: Kullanıcının oturumlarını sil
const clearUserSessions = async (userId) => {
  await Session.deleteMany({ userId });
};

export default {
  register,
  login,
  refreshSession,
  logout,
  findUserByEmail,
  sendResetPasswordEmail,
  verifyResetToken, // Yeni fonksiyon
  updatePassword, // Yeni fonksiyon
  clearUserSessions, // Yeni fonksiyon
};
