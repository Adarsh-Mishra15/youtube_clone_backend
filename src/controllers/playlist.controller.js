import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name))
    {
        return new ApiError(400, "Name is required")
    }
    
    await Playlist.create(
        {
            name,
            description:description || "",
            owner:req.user._id,
            video:[]
        }
    )

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"playlist created successfullyt"))
            )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId))
    {
        throw new ApiError(400, "Invalid user id")
    }
    const playlist = await Playlist.find({owner:userId})

    if(!playlist.length)
        {
            throw new ApiError(400,"Playlist does not exist")
        }

    return res
            .status(200)
            .json(
                (new ApiResponse(200,playlist,"User playlist"))
            )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(400,"Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(400,"Playlist does not exist")
    }

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Playlist fetched through Id",playlist))
            )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!(isValidObjectId(playlistId) && isValidObjectId(videoId)))
    {
        throw new ApiError(400,"Invalid playlistId or videoId")
    }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(400,"Playlist does not exist")
    }

    playlist.video = [...playlist.video,videoId]
    await playlist.save()
    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Video added to playlist",playlist))
            )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(isValidObjectId(playlistId) && isValidObjectId(videoId)))
        {
            throw new ApiError(400,"Invalid playlistId or videoId")
        }
    const playlist = await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(400,"playlist does not exist")
    }

    const index = playlist.video.indexOf(videoId)

    if(index > -1)
    playlist.video.splice(index,1)

    await playlist.save()

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Video removed from playlist",playlist))
            )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!(isValidObjectId(playlistId)))
    {
        throw new ApiError(400,"Invalid playlistId")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Playlist deleted"))
            )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId))
    {
        throw new ApiError(400,"Invalid playlistId")
    }

    if(!(name))
    {
        throw new ApiError(400,"Name is required")
    }
    
    await Playlist.findByIdAndUpdate(playlistId,
        {
            name:name,
            description:description || "",

        }
    )

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Playlist updated"))
            )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}