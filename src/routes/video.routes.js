import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { publishAVideo, getVideoById } from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route('/publish-video').post(verifyJWT,upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    }, 
    {
        name: "thumbnail",
        maxCount: 1
    }
]),publishAVideo)

router.route('/c/:videoId').get(getVideoById)


export default router