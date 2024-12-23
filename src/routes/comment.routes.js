import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/:videoId").post(verifyJWT,addComment)

router.route("/:commentId").patch(verifyJWT,updateComment)

router.route("/:videoId/:commentId").delete(verifyJWT, deleteComment)

router.route("/:videoId").get(getVideoComments)

export default router