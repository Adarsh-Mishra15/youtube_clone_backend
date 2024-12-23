import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteTweet, getUserTweets, publishTweet, updateTweet } from "../controllers/tweet.controller.js";
import { deleteComment, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/publish-tweet").post(verifyJWT,upload.single("poster"),publishTweet)

router.route("/").get(verifyJWT,getUserTweets)

router.route("/:tweetId").patch(verifyJWT,upload.single("poster"),updateTweet)

router.route("/:tweetId").delete(verifyJWT,deleteTweet)

export default router