import mongoose, {Schema} from "mongoose";
import { type } from "os";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username:{type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true}, // Username saved in database in lowercase
        fullName:{type:String,trim:true,index:true},
        password:{type:String,required:true,required:[true,"Password is required"]},
        avatar:{type:String, required:true}, // cloudinary url
        coverImage:{type:String}, // cloudinary url
        email:{type:String,required:true,unique:true,lowercase:true},
        watchHistory:{type:Schema.Types.ObjectId, ref:"Video"}
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    
    next()
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    const token = jwt.sign({_id:this._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:60*60})

    return token
}

userSchema.methods.generateResfreshToken = function(){
    const token = jwt.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:60*60*60})
    return token
}

export const User = mongoose.model("User",userSchema);