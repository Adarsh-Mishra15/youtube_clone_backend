import { Router } from "express";
import { getLikedVideos, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/:videoId").post(verifyJWT,toggleVideoLike)

router.route("/").get(verifyJWT,getLikedVideos)

router.route("/:tweetId").post(verifyJWT,toggleTweetLike)

export default router