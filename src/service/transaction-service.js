import { query } from "../application/database.js"
import { validate } from "../validation/validation.js"
import { getBalanceValidation, paymentValidation, topupValidation } from "../validation/transaction-validation.js"
import { v4 as uuid } from "uuid"
import { ResponseError } from "../error/response-error.js"

const getBalance = async (userId) => {
    // validasi internal
    const { user_id } = validate(getBalanceValidation, { user_id: userId })

    const rows = await query(
        `
            SELECT 
            IFNULL(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) -
            IFNULL(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) 
            AS balance
            FROM transactions
            WHERE user_id = ?
        `,
        [user_id]
    )

    const balance = rows[0]?.balance || 0

    return {
        status: 0,
        message: "Get Balance Berhasil",
        data : {
            balance: balance
        }
    }
}

const topup = async (userId, request) => {
    const { amount } = validate(topupValidation, request)

    await query(
        `
        INSERT INTO transactions (user_id, service_id, invoice_number, transaction_type, description, total_amount, created_on)
        VALUES (?, NULL, null, 'TOPUP', 'Top Up Saldo', ?, NOW())
        `,
        [userId, amount]
    )

    const rows = await query(
        `
        SELECT 
        IFNULL(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) -
        IFNULL(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) AS balance
        FROM transactions
        WHERE user_id = ?
        `,
        [userId]
    )

    const balance = rows[0]?.balance || 0

    return {
        status: 0,
        message: "Top Up Balance berhasil",
        data: { balance },
    }
}

const createTransaction = async (userId, request) => {
    const { service_code } = validate(paymentValidation, request)

    const services = await query(
        "SELECT * FROM services WHERE service_code = ?",
        [service_code]
    )

    if (services.length === 0) {
        throw new ResponseError(102, "Service ataus Layanan tidak ditemukan")
    }

    const service = services[0]
    const serviceTariff = parseInt(service.service_tariff, 10)
    if (isNaN(serviceTariff)) {
        throw new ResponseError(102, "Service atau Layanan tidak memiliki tarif valid")
    }

    const balanceRows = await query(
        `
        SELECT 
            IFNULL(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) -
            IFNULL(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) AS balance
        FROM transactions
        WHERE user_id = ?
        `,
        [userId]
    )

    const currentBalance = balanceRows[0]?.balance || 0

    if (currentBalance < serviceTariff) {
        throw new ResponseError(103, "Saldo tidak mencukupi untuk melakukan transaksi")
    }

    // 4. Generate invoice_number unik
    const invoiceNumber = `INV${Date.now()}-${uuid().slice(0, 6).toUpperCase()}`

    await query(
        `
        INSERT INTO transactions (user_id, service_id, invoice_number, transaction_type, description, total_amount, created_on)
        VALUES (?, ?, ?, 'PAYMENT', ?, ?, NOW())
        `,
        [userId, service.id, invoiceNumber, service.service_name, serviceTariff]
    )

    const transactionRows = await query(
        `
        SELECT 
            invoice_number,
            s.service_code,
            s.service_name,
            t.transaction_type,
            t.total_amount,
            t.created_on
        FROM transactions t
        JOIN services s ON t.service_id = s.id
        WHERE t.invoice_number = ?
        `,
        [invoiceNumber]
    )

    const transaction = transactionRows[0]

    return {
        status: 0,
        message: "Transaksi berhasil",
        data: transaction
    }
}

const getHistory = async (userId, limit) => {
    let sqlLimit = "" 
    const params = [userId]

    if (limit && !isNaN(limit)) {
        sqlLimit = "LIMIT ?"
        params.push(parseInt(limit, 10))
    }

    const rows = await query(
        `
        SELECT 
            invoice_number,
            transaction_type,
            CASE 
                WHEN transaction_type = 'TOPUP' THEN 'Top Up balance'
                ELSE s.service_name
            END AS description,
            t.total_amount,
            t.created_on
        FROM transactions t
        LEFT JOIN services s ON t.service_id = s.id
        WHERE t.user_id = ?
        ORDER BY t.created_on DESC
        ${sqlLimit}
        `,
        params
    )

    return {
        offset: 0,
        limit: limit ? parseInt(limit, 10) : rows.length,
        records: rows,
    }
}

export default { getBalance, topup, createTransaction, getHistory  }