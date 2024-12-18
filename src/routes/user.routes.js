import { Router } from "express";
import { registerUser, logInUser, logOutUser, refreshAccessToken } from "../controllers/user.controller.js";
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

export default router;
