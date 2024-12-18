import { Router } from "express";
import { 
    registerUser,
    logInUser,
    logOutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateCoverImage
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, 
    {
        name: "coverImage",
        maxCount: 1
    }
]),
registerUser) 

router.route('/login').post(logInUser)

// Secured routes

router.route('/logout').get(verifyJWT, logOutUser)
router.route('/refresh-token').get(verifyJWT,refreshAccessToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/current-user').get(verifyJWT, getCurrentUser)
router.route('/update-avatar').post(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route('/update-coverimage').post(verifyJWT, upload.single("coverImage"),updateCoverImage)

export default router;
