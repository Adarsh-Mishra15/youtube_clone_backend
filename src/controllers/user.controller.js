import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apierror.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"
import {sendPasswordChangeNotification} from "../utils/emailService.js"


const generateAccessAndRefereshTokens = async(userId) =>{
   try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       //console.log("Access Token : ", accessToken)
       const refreshToken = user.generateResfreshToken()
        // console.log("Refresh Token: ", refreshToken)
       user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false })

       return {accessToken, refreshToken}


   } catch (error) {
       throw new ApiError(500, "Something went wrong while generating referesh and access token")
   }
}

const registerUser = asyncHandler(async (req, res) => {
   const {username, fullName, email, password} = req.body
   
   //INdividual validation
  /* if(fullName==="")
   {
      throw new ApiError(400,"Full Name is  required");
   } */

      // combined validation
      if([fullName,email,username, password].some((field)=>{field?.trim()===""})){
         throw new ApiError(400,"All fields are required");
      }

      // If user already exist
      const existedUser = await User.findOne({$or:[{username,email}]})

      if(existedUser){
         throw new ApiError(409,"User with email or username already exist");
      }

      // Check for images
       const avatarLocalPath = req.files?.avatar[0]?.path
       const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null; 
       
       if(!avatarLocalPath)
       {
        throw new ApiError(404,"Avatar file is required")
       }
       // upload these files on cloudinary

       const avatar = await uploadOnCloudinary(avatarLocalPath)
       if(coverImageLocalPath)
       {
       var coverImage = await uploadOnCloudinary(coverImageLocalPath)
       }

       if(!avatar)
       {
         throw new ApiError(404,"avatar image not uploaded on cloudinary")
       }

       //Create user object --> entry in db

       const user = await User.create({
         fullName,
         username,
         email,
         password,
         avatar:avatar.url,
         coverImage:coverImage?.url || "",
       })

       // Check whether user created or not

       const createdUser = await User.findById(user._id).select("-password -refreshToken")

       if(!createdUser)
       {
         throw new ApiError(500,"Something went wrong while registering the user");
       }

       return res
       .status(201)
       .json(
         new ApiResponse(200,createdUser,"User created Successfully")
      )
});

const logInUser = asyncHandler(async(req,res)=>{
   // 
   const {username, email, password} = req.body

   // username or email not provided
   if(!username && !email)
   {
      throw new ApiError(400,"Username and email are required")
   }
   // username or email provided but password not provided
   if(!password)
   {
      throw new ApiError(400,"Password is required")
   }

   // Is password correct or not
   const user = await User.findOne({$or:[{username},{email}]}).select("-refreshToken")
   if(!user)
   {
      throw new ApiError(404,"user not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid)
   {
      throw new ApiError(404,"Enter valid password")
   }
   // Generate token
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   // Logged in user

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options={
      httpOnly:true,
      secure:true
   }

   return res
   .status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
      new ApiResponse(200,loggedInUser,"User logged in Successfully")
   )


})

const logOutUser = asyncHandler(async (req,res)=>{
   // Get user from cookie
    await User.findByIdAndUpdate(req.user._id,{
      $unset:{refreshToken:1}
    },
   {
      new:true
   }
)

  const options = {
      httpOnly:true,
      secure:true
   }

  return res
   .clearCookie("refreshToken",options)
   .clearCookie("accessToken",options)
   .status(200)
   .json(new ApiResponse(200,"User logged out successfully"))
  
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   // Get refresh token from cookie
   const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingrefreshToken)
   {
      throw new ApiError(401,"unauthorized request")
   }
      const decoded_token = jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);

   const user = await User.findById(decoded_token._id)
   if(!user)
   {
      throw new ApiError(401,"Invalid refresh token")
   }
   if(incomingrefreshToken!==user?.refreshToken)
   {
      throw new ApiError(401,"Refresh token is expired")
   }

   const {accessToken,newrefreshToken} = await generateAccessAndRefereshTokens(user._id)

   const options ={
      httpOnly:true,
      secure:true
   }

   return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newrefreshToken,options)
            .json(new ApiResponse(200,"Access token generated successfully"))
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {username, oldPassword, newPassword} = req.body

   // username, oldPassword and newPassword all are required field
   if(!(username && oldPassword && newPassword))
   {
      throw new ApiError(400,"All fields are required")
   }

   const user = await User.findOne({username}).select("-refreshToken")

   if(!user)
   {
      throw new ApiError(404,"NO user exists with this username")
   }
   const isValidPassword = await user.isPasswordCorrect(oldPassword)
   if(!isValidPassword)
   {
      throw new ApiError(400,"Incorrect password, Try again")
   }

   user.password = newPassword
   await user.save({validateBeforeSave:false})

   await sendPasswordChangeNotification(req.user.email,req.user.username)
   
   return res
         .status(200)
         .json(
            new ApiResponse(200,"Password changed successfully")
         )
})

const getCurrentUser = asyncHandler(async(req,res)=>{
   
      return res
               .status(200)
               .json(
                  (new ApiResponse(200,req.user,"Fetched user data successfully"))
               )
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
   const avatarLocalPath = req.file?.path

   if(!avatarLocalPath)
   {
      throw new ApiError(400,"Avatar file is required, Upload avatar file")
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url)
   {
      throw new ApiError(400,"Error while uploading on cloudinary")
   }
   
   const user = await User.findByIdAndUpdate(req.user._id,{
      $set:{avatar:avatar.url}
    },
   {
      new:true
   }
)

   return res
            .status(200)
            .json(
               (new ApiResponse(200,user,"Updated user avatar successfully"))
            )

})

const updateCoverImage = asyncHandler(async(req,res)=>{
      const coverImageLocalPath = req.file?.path
      if(!coverImageLocalPath)
      {
         throw new ApiError(400,"Cover Image file is required")
      }

      const coverImage = await uploadOnCloudinary(coverImageLocalPath)

      if(!coverImage.url)
      {
         throw new ApiError(400,"Error while uploading cover Image")
      }

      const user = await User.findByIdAndUpdate(req.user?._id,{
         $set:{
            coverImage:coverImage.url
         }
      },
      {
         new:true
      }
   )

   return res
            .status(200)
            .json(
               (new ApiResponse(200,user,"Updated user cover image successfully"))
            )
})

export { 
   registerUser,
   logInUser,
   logOutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateUserAvatar,
   updateCoverImage
 };
