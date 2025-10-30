import mysql from "mysql2/promise"
import {logger} from "./logging.js"

export const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_nutecht",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export async function query(sql, params = []) {
    try {
        logger.info(`[QUERY] ${sql} | Params: ${JSON.stringify(params)}`)
        const [rows] = await db.query(sql, params)
        return rows
    } catch (err) {
        if (err.code === "ER_WARN_DATA_TRUNCATED") {
        logger.warn(`[WARN] ${err.message}`)
        } else {
        logger.error(`[ERROR] ${err.message}`)
        }
        throw err
    }
}

export const JWT_CONFIG = {
  secret: "super_secret_jwt_key_123", // ganti dengan string kuat milikmu
  expiresIn: "12h", // 12 jam
}