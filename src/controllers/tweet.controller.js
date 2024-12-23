import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishTweet = asyncHandler(async(req,res)=>{
    const {title,text} = req.body
    if(!(text && title))
    {
        throw new ApiError(400,"Text and title is required")
    }

    const posterLocalPath = req.file?.path
    
    if(!posterLocalPath)
    {
        throw new ApiError(400,"Poster is required")
    }
    const poster = await uploadOnCloudinary(posterLocalPath)

    if(!poster.url)
    {
        throw new ApiError(400,"Poster upload failed")
    }

   const tweet = await Tweet.create(
        {
            content:text,
            owner:req.user._id,
            poster:poster.url,
            title:title

        }
    )

    return res
            .status(200)
            .json(
                new ApiResponse(200,tweet,"Tweet published successfully")
            )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets = await Tweet.find({ owner: req.user._id }).populate("owner");
    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "User tweets retrieved successfully")
        );

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId))
    {
        throw new ApiError(400,"Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet)
        {
            throw new ApiError(404,"Tweet not found")
        }
    const {title,description} = req.body
    if(!(title && description))
    {
        throw new ApiError(400,"Title and description is required")
    }
    tweet.title = title
    tweet.content = description
    await tweet.save()

    return res
            .status(200)
            .json(
                new ApiResponse(200,tweet,"Tweet updated successfully")
                )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId))
        {
            throw new ApiError(400,"Invalid tweet id")
        }
      
        await Tweet.findByIdAndDelete(tweetId)

    return res
            .status(200)
            .json(
                new ApiResponse(200,"Tweet deleted successfully")
            )
})

export {
    publishTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}