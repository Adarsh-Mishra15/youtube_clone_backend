import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from "../controllers/video.controller.js"
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
router.route('/c/:videoId/update-video').post(verifyJWT,upload.single("thumbnail") ,updateVideo)
router.route('/c/:videoId/delete-video').get(verifyJWT,deleteVideo)
router.route('/c/:videoId/toggle-video').get(verifyJWT,togglePublishStatus)



export default router