import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apierror"
import {asyncHandler} from "../utils/asynchandler"
import { User } from "../models/user.models"

const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

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

    req.user = usernext()
})

export {verifyJWT}