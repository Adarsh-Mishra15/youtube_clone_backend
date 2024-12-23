import mongoose,{isValidObjectId} from "mongoose";
import { Video } from "../models/video.models.js";
import { Likes } from "../models/like.models.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        return res.status(400).json({ message: "Invalid video id" });
        }

    const video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json({ message: "Video not found" });
        }

    const like = await Likes.findOne({ video: videoId, likedBy: req.user._id })
    if (like) {
        await Likes.deleteOne({ video: videoId, likedBy: req.user._id })
        video.likes = video.likes-1
        }
    else {
            const newLike = new Likes({ video: videoId, likedBy: req.user._id })
            await newLike.save()
            video.likes = video.likes+1
          }
        
    await video.save()

    return res
            .status(200)
            .json(
                new ApiResponse(200,"Toggle the like")
            )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId))
    {
        throw new ApiError(400,"Invalid comment Id")
    }

    const comment = Comment.findById(commentId)
    if(!comment)
    {
        throw new ApiError(404,"Comment not found")
    }

    const like = await Likes.findOne({comment:commentId,likedBy:req.user._id})
    if(like)
    {
        await Likes.deleteOne({comment:commentId,likedBy:req.user._id})
        comment.likes = comment.likes-1
    }
    else{
        const newLike = new Likes({comment:commentId,likedBy:req.user._id})
        comment.likes = comment.likes+1
        await newLike.save()
        
    }

    await comment.save()

    return res
            .status(200)
            .json(
                new ApiResponse(200,"Toggle the like")
                )


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId))
        {
            throw new ApiError(400,"Invalid tweet Id")
        }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
    {
        throw new ApiError(404,"Tweet not found")
    }

    const like = await Likes.find({tweet:tweetId,likedBy:req.user._id})
    if(like)
    {
        await Likes.deleteOne({tweet:tweetId,likedBy:req.user._id})
        tweet.likes = tweet.likes-1
    }
    else
    {
        const newLike = new Likes({tweet:tweetId,likedBy:req.user._id})
        tweet.likes = tweet.likes+1
        await newLike.save()
    }

   await tweet.save() 

   return res
            .status(200)
            .json(
                new ApiResponse(200,"Toggle the like")
                )
        
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    
    const likes = await Likes.find({likedBy:req.user._id})
    const likedVideos = []
    for(let i=0;i<likes.length;i++)
        {
            likedVideos.push(likes[i].video)
        }

     return res
            .status(200)
            .json(
                new ApiResponse(200,"Liked videos",likedVideos)
                )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}