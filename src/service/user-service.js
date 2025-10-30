import { query, JWT_CONFIG } from "../application/database.js"
import { loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import { ResponseError } from "../error/response-error.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// REGISTER
const register = async (request) => {
  const user = validate(registerUserValidation, request)

  const rows = await query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [user.email])
  if (rows[0].count > 0) throw new ResponseError(400, "Email already exists")

  user.password = await bcrypt.hash(user.password, 10)

  await query(
    "INSERT INTO users (first_name, last_name, password, email, token) VALUES (?, ?, ?, ?, NULL)",
    [user.first_name, user.last_name, user.password, user.email]
  )

  return {
    status: 0,
    message: "Registrasi berhasil silahkan login",
    data: null,
  }
}

// LOGIN
const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request)
  const rows = await query("SELECT id, email, password, first_name, last_name FROM users WHERE email = ?", [loginRequest.email])

  if (rows.length === 0) throw new ResponseError(401, "Email or password is incorrect")

  const user = rows[0]
  const valid = await bcrypt.compare(loginRequest.password, user.password)
  if (!valid) throw new ResponseError(401, "Email or password is incorrect")


  const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_CONFIG.secret,
        { expiresIn: JWT_CONFIG.expiresIn })

  return { token }
}

// GET USER
const get = async (userId) => {
  const rows = await query(
    "SELECT email, first_name, last_name FROM users WHERE id = ?",
    [userId]
  )

  if (rows.length === 0) {
    throw new ResponseError(404, "User not found")
  }

  return rows[0]
}

const update = async (request) => {
  const user = validate(updateUserValidation, request)

  // Pastikan user ada
  const rows = await query(
    "SELECT COUNT(*) AS count FROM users WHERE id = ?",
    [user.id]
  )
  
  if (rows[0].count === 0) {
    throw new ResponseError(404, "User not found")
  }

  // Siapkan data untuk update
  let sql = "UPDATE users SET "
  const params = []

  if (user.first_name) {
    sql += "first_name = ?, "
    params.push(user.first_name)
  }

  if (user.last_name) {
    sql += "last_name = ?, "
    params.push(user.last_name)
  }

  if (user.password) {
    const hashed = await bcrypt.hash(user.password, 10)
    sql += "password = ?, "
    params.push(hashed)
  }

  sql = sql.replace(/, $/, " ") + "WHERE id = ?"
  params.push(user.id)

  await query(sql, params)

  // Ambil data terbaru
  const updatedRows = await query(
    "SELECT email, first_name, last_name FROM users WHERE id = ?",
    [user.id]
  )

  return {
    status: 0,
    message: "Sukses",
    data: updatedRows[0],
  }
}

// LOGOUT
const logout = async () => ({ message: "Logout successful"})

const uploadProfileImage  = async (userId, file) => {
  if (!file) {
    throw new ResponseError(102, "Format Image tidak sesuai")
  }

  const profileUrl = `https://localhost:5000/uploads/${file.filename}`

  await query(
    `UPDATE users SET profile_image = ? WHERE id = ?`,
    [profileUrl, userId]
  )

  const rows = await query(
    `SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?`,
    [userId]
  )

  if (rows.length === 0) {
    throw new ResponseError(404, "User not found")
  }

  return {
    status: 0,
    message: "Update Profile Image berhasil",
    data: rows[0]
  }
}

export default { register, login, get, logout, update, uploadProfileImage}
