import Joi from "joi"

const getBalanceValidation = Joi.object({
  user_id: Joi.number().required(),
})

const topupValidation = Joi.object({
    amount: Joi.number().min(0).required().messages({
        "number.base": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "number.min": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        "any.required": "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
    })
})

const paymentValidation = Joi.object({
    service_code: Joi.string().required().messages({
        "any.required": "Service atau Layanan harus diisi",
        "string.empty": "Service atau Layanan harus diisi"
    })
})

export {
    getBalanceValidation,
    topupValidation,
    paymentValidation
}