import Joi from "joi"

const registerUserValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().max(200).email().required().messages({
      'string.email': 'Parameter email tidak sesuai format',
      'string.empty': 'Parameter email tidak boleh kosong',
      'any.required': 'Parameter email wajib diisi',
      'string.max': 'Parameter email maksimal 200 karakter',
    }),
    password: Joi.string().min(8).max(100).required()
})

const loginUserValidation = Joi.object({
    email: Joi.string().max(200).email().required().messages({
      'string.email': 'Parameter email tidak sesuai format',
      'string.empty': 'Parameter email tidak boleh kosong',
      'any.required': 'Parameter email wajib diisi',
      'string.max': 'Parameter email maksimal 200 karakter',
    }),
    password: Joi.string().max(100).required()
})

const getUserValidation = Joi.string().max(100).required()

const updateUserValidation = Joi.object({
    id: Joi.number().required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    email: Joi.string().max(200).email().required().messages({
      'string.email': 'Parameter email tidak sesuai format',
      'string.empty': 'Parameter email tidak boleh kosong',
      'any.required': 'Parameter email wajib diisi',
      'string.max': 'Parameter email maksimal 200 karakter',
    }),
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}