import express from "express"
import userController from "../controller/user-controller.js"
import healthController from "../controller/health-controller.js"
import bannerController from "../controller/banner-controller.js"

const publicRouter = new express.Router()
publicRouter.post('/api/registration', userController.register)
publicRouter.post('/api/login', userController.login)
publicRouter.get("/api/banner", bannerController.getAll)
publicRouter.get('/ping', healthController.ping)

export {
    publicRouter
}