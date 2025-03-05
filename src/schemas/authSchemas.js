import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Yeni şema: Şifre sıfırlama e-postası için
export const resetPasswordEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Yeni şema: Şifre sıfırlama için
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
