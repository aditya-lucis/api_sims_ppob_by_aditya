import transactionService from "../service/transaction-service.js"

const get = async (req, res, next) => {
    try {
        const result = await transactionService.getBalance(req.user.id)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const topup = async (req, res, next) => {
    try {
        const result = await transactionService.topup(req.user.id, req.body)
        res.status(200).json(result)
    } catch (e) {
        if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null,
            })
        }
        next(e)
    }
}

const createPayment = async (req, res, next) => {
    try {
        const result = await transactionService.createTransaction(req.user.id, req.body)
        res.status(200).json(result)
    } catch (e) {
        if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 108,
                message: "Token tidak tidak valid atau kadaluwarsa",
                data: null,
            })
        }

        if (e instanceof Object && e.status && e.message) {
            return res.status(400).json({
                status: e.status,
                message: e.message,
                data: null,
            })
        }
        next(e)
    }
}

const getHistory = async (req, res, next) => {
    try {
        const limit = req.query.limit
        const userId = req.user.id
        const result = await transactionService.getHistory(userId, limit)

        res.status(200).json({
            status: 0,
            message: "Get History Berhasil",
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

export default { get, topup, createPayment, getHistory }