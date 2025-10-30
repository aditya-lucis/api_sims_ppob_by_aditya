import express from "express"
import userController from "../controller/user-controller.js"
import {authMiddleware} from "../middleware/auth-middleware.js"
import { upload } from "../middleware/upload-middleware.js"
import serviceController from "../controller/service-controller.js"
import transactionController from "../controller/transaction-controller.js"
import multer from "multer"

const userRouter = new express.Router()
userRouter.use(authMiddleware)

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const uploadProfileImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png"]
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Format Image tidak sesuai"), false)
        }
        cb(null, true)
    }
})

userRouter.post("/api/profile/image",authMiddleware,uploadProfileImage.single("file"),userController.updateProfileImage)
userRouter.get('/api/profile', userController.get)
userRouter.patch('/api/profile/update', userController.update)
userRouter.delete('/api/users/logout', userController.logout)
userRouter.get("/api/services", serviceController.getAll)
userRouter.get("/api/balance", transactionController.get)
userRouter.get("/api/transaction/history", transactionController.getHistory)
userRouter.post("/api/topup", transactionController.topup)
userRouter.post("/api/transaction", transactionController.createPayment)
userRouter.post("/api/profile/image", upload.single("file"), userController.updateProfileImage)

export {
    userRouter
}