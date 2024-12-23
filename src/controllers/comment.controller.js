import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/apierror.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Comment } from "../models/comment.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 2, sortBy = 'createdAt', sortType = 'desc' } = req.query;

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortType === 'asc' ? 1 : -1;

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Fetch video with populated comments
    const video = await Video.findById(videoId)
        .populate({
            path: 'comments', // Path to populate
            options: {
                sort: sortOptions,
                skip: skip,
                limit: parseInt(limit),
            },
        });

    if (!video) {
        throw new ApiError('Video not found', 404);
    }

    // Get total comments count
    const total = video.comments.length;

    // Return response
    return res.status(200).json({
        success: true,
        data: video.comments, // Populated comments
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        },
    });
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {text} = req.body
    //const {userId} = req.user

    //console.log(req.user)

    if(!(isValidObjectId(videoId)))
    {
        throw new ApiError(400,"Invalid Video")
    }


    const video = await Video.findById(videoId)
    if(!video)
    {
        throw new ApiError(400,"No video exists")
    }

    if(!text)
    {
        throw new ApiError(400,"Text is required")
    }

    const user = await User.findById(req.user._id)
    if(!user)
    {
        throw new ApiError(400,"User does not exist, login to comment")
    }

    

    const comment = await Comment.create(
        {
            content:text,
            video:videoId,
            owner:req.user._id
        }
    )

    if(!comment)
    {
        throw new ApiError(400,"Error in commenting")
    }

    video.comments = [...video.comments,comment._id]
    await video.save({validateBeforeSave:false})
    return res
            .status(200)
            .json(
                new ApiResponse(200,"Comment added successfully")
            )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {text} = req.body
    if(!text)
        {
            throw new ApiError(400,"Text is required")
        }
        
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content:text
            }
         }
    )

    //const video = await Video.find({comments:commentId})

    return res
            .status(200)
            .json(
                new ApiResponse(200,comment,"Comment updated successfully")
            )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId,videoId} = req.params

    if(!(isValidObjectId(commentId)&& isValidObjectId(videoId)))
    {
        throw new ApiError(400,"Invalid comment or video id")
    }

    await Comment.findByIdAndDelete(commentId)

    const video = await Video.findById(videoId)
    const index = video.comments.indexOf(commentId)

    if(index > -1)
    video.comments.splice(index,1)

    await video.save()

    return res
            .status(200)
            .json(
                new ApiResponse(200,"Comment deleted successfully",video)
            )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }