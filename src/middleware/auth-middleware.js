import jwt from "jsonwebtoken"
import { JWT_CONFIG } from "../application/database.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ errors: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    const payload = jwt.verify(token, JWT_CONFIG.secret)

    req.user = { id: payload.id, email: payload.email }

    next()
  } catch (err) {
    console.error("JWT Error:", err.message)
    return res.status(401).json({ errors: "Invalid or expired token" })
  }
}
