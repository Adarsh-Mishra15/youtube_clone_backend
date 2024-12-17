import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apierror.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";


const generateAccessTokenAndRefreshToken = function(){


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
       const coverImageLocalPath = req.files?.coverImage[0]?.path

       if(!avatarLocalPath)
       {
        throw new ApiError(404,"Avatar file is required")
       }
       // upload these files on cloudinary

       const avatar = await uploadOnCloudinary(avatarLocalPath)
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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
         coverImage:coverImage.url?.url || "",
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

export { registerUser };
