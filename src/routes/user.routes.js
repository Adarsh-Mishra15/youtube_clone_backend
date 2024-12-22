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
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User registration route
router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser); 

// User login route
router.route('/login').post(logInUser);

// Secured routes (requiring JWT token)
router.route('/logout').post(verifyJWT, logOutUser);  // Changed GET to POST for logout
router.route('/refresh-token').get(verifyJWT, refreshAccessToken);
router.route('/change-password').patch(verifyJWT, changeCurrentPassword); // Changed POST to PATCH for password change
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar); // Changed POST to PATCH for avatar update
router.route('/update-coverimage').patch(verifyJWT, upload.single("coverImage"), updateCoverImage); // Changed POST to PATCH for cover image update

export default router;