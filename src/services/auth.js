import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
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
  // Refresh token'ı kullanarak oturumu bul ve sil
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }
};

export default {
  register,
  login,
  refreshSession,
  logout,
};
