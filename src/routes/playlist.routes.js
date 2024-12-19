import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addVideoToPlaylist,
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists, 
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router()

router.route('/create-playlist').post(verifyJWT,createPlaylist)
router.route('/c/:userId/get-playlists').get(verifyJWT,getUserPlaylists)
router.route('/c/:playlistId/get-playlistById').get(verifyJWT,getPlaylistById)
router.route('/c/:playlistId/add-video/:videoId').get(verifyJWT,addVideoToPlaylist)
router.route('/c/:playlistId/delete-video/:videoId').get(verifyJWT,removeVideoFromPlaylist)
router.route('/c/:playlistId/delete-playlist').get(verifyJWT,deletePlaylist)
router.route('/c/:playlistId/update-playlist').post(verifyJWT,updatePlaylist)

export default router