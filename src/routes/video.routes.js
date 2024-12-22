import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus, 
    getAllVideos 
} from "../controllers/video.controller.js"
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

router.route('/:videoId').get(getVideoById)
router.route('/:videoId').patch(verifyJWT,upload.single("thumbnail") ,updateVideo)
router.route('/:videoId').delete(verifyJWT,deleteVideo)
router.route('/:videoId/toggle-video').get(verifyJWT,togglePublishStatus)

// Route to get all videos with optional filters, sorting, and pagination
router.get("/", getAllVideos);


export default router