import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    
    if(!(videoLocalPath && thumbnailLocalPath)){
        throw new ApiError(400,"Video file and thubnail both are required")
    }

    const videoOnCloud = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!(videoOnCloud.url && thumbnail.url))
    {
        throw new ApiError(400,"Error while uploading the video or thumbnail")
    }

    const video = await Video.create(
        {
            title,
            description,
            videoFile:videoOnCloud.url,
            owner:req.user._id,
            thumbnail:thumbnail.url,
            isPublished:true,
            duration:videoOnCloud.duration
        }
    )

    return res
            .status(200)
            .json(
                new ApiResponse(200,"Video published successfully")
            )
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    console.log("video Id:  ",videoId);

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"No video exist")
    }

    return res
            .status(200)
            .json(
                new ApiResponse(200,video,"Video fetched successfully")
            )

       

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}