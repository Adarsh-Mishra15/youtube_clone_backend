import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apierror.js"
import {asyncHandler} from "../utils/asynchandler.js"
import { User } from "../models/user.models.js"

const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token =await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token)
    {
        throw new ApiError(401,"Unauthorized acces")
    }

const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
const user =  await User.findById(decoded_token._id).select("-password -refreshToken")

if(!user)
{
    throw new ApiError(401,"Inavalid access token")
}

    req.user = user
    next()
})

export {verifyJWT}