const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateRegisterBody = celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.email': 'Некорректная почта',
        'any.required': 'Обязательное поле',
      }),
    password: Joi
      .string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Минимальная длина пароля 2 символа',
        'string.max': 'Максимальная длина пароля 30 символов',
        'any.required': 'Обязательное поле',
      }),
  })
    .unknown(),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(
        'Некорректная ссылка на аватар',
      );
    }),
  }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(
        'Некорректная ссылка на изображение',
      );
    }),
  }),
});

module.exports = {
  validateCardInfo,
  validateRegisterBody,
  validateUpdateAvatar,
};