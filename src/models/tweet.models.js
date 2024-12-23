import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        content:{
            type:String,
            required:true
        },
        likes:{
            type:Number,
            default:0
        },
        poster:{
            type:String,
        }
    }
)

export const Tweet = mongoose.model("Tweet",tweetSchema)