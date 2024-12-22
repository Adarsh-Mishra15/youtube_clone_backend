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

const router = Router();

// route updated based on standard methods

// Create a new playlist
router.post('/create', verifyJWT, createPlaylist);

// Get all playlists for a user
router.get('/:userId/get-playlists', verifyJWT, getUserPlaylists);

// Get a specific playlist by ID
router.get('/:playlistId', verifyJWT, getPlaylistById);

// Add a video to a playlist
router.put('/:playlistId/video/:videoId', verifyJWT, addVideoToPlaylist);

// Remove a video from a playlist
router.delete('/:playlistId/video/:videoId', verifyJWT, removeVideoFromPlaylist);

// Delete a playlist
router.delete('/:playlistId', verifyJWT, deletePlaylist);

// Update a playlist
router.patch('/:playlistId', verifyJWT, updatePlaylist);

export default router;
