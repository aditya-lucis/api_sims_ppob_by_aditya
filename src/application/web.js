import express from "express"
import { publicRouter } from "../route/public-api.js"
import { userRouter } from "../route/api.js"
import { errorMiddleware } from "../middleware/error-middleware.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const web = express()

web.use(express.json())
web.use(express.urlencoded({ extended: true }))
web.use( "/uploads", express.static(path.join(__dirname, "../../uploads")) )
web.use(publicRouter)
web.use(userRouter)
web.use(errorMiddleware)