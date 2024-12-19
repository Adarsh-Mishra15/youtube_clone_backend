import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 2, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    // Build a dynamic query object
    const filter = {};

    // Add query filters
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // Case-insensitive search for the title
    }

    if (userId) {
        filter.owner = (userId); // Filter videos by userId if provided
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Pagination calculations
    const skip = (page - 1) * limit;

    console.log(sortOptions)

    // Fetch videos with the applied filters, sorting, and pagination
    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

    // Fetch total count for pagination metadata
    const total = await Video.countDocuments(filter);

    // Return the response
    return res.status(200).json({
        success: true,
        data: videos,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        },
    });
});


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

    if(!videoId)
    {
        throw new ApiError(400,"Video ID in url is required")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"No video exist")
    }

    const {title, description} = req.body

    if(!(title && description))
    {
        throw new ApiError(400,"All fields are required")
    }

    
    const thumbnailLocalPath = req.file?.path

    if(!thumbnailLocalPath)
    {
        throw new ApiError(400,"thumbnail is requied")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail.url)
    {
        throw new ApiError(400,"Failed to upload thumbnail")
    }
    
    await Video.findByIdAndUpdate(videoId,{
        title:title,
        description:description,
        thumbnail:thumbnail.url
    })

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"fields updated"))
            )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId)
    {
        throw new ApiError(400,"video id required")
    }

    if(!(mongoose.Types.ObjectId.isValid(videoId)))
    {
        throw new ApiError(400,"Invalid video id")
    }

    await Video.findByIdAndDelete(videoId)

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Video deleted successfully"))
            )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId)
    {
        throw new ApiError(400,"video id required")
    }

    if(!mongoose.Types.ObjectId.isValid(videoId))
    {
        throw new ApiError(400,"Invalid video id")
    }

    const video = await Video.findByIdAndUpdate(videoId)

    if(!video)
    {
        throw new ApiError(400,"video does not exist")
    }

    video.isPublished = !video.isPublished

    video.save({validateBeforeSave:false})

    return res
            .status(200)
            .json(
                (new ApiResponse(200,"Video status updated successfully"))
            )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}