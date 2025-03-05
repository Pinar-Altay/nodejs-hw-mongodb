import authService from '../services/auth.js';
import createHttpError from 'http-errors';

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await authService.register({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await authService.login({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshSession(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not found');
    }

    // Oturumu sonlandır
    await authService.logout(refreshToken);

    // Cookie'yi temizle
    res.clearCookie('refreshToken');

    // Yanıt gövdesi olmadan 204 durum kodu döndür
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Kullanıcıyı bul
    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Şifre sıfırlama e-postası gönder
    await authService.sendResetPasswordEmail(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Token'ı doğrula ve e-posta adresini al
    const { email } = await authService.verifyResetToken(token);

    // Kullanıcıyı bul
    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Şifreyi güncelle
    await authService.updatePassword(email, password);

    // Kullanıcının oturumlarını sil
    await authService.clearUserSessions(user._id);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


export default {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
};
