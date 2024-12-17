import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        videoFile:{type:String, required:true}, //cloudinary Url
        thumbnail:{type:String,required:true}, //cloudinary
        title:{type:String,required:true},
        description:{type:String,required:true},
        views:{type:Number,default:0},
        likes:{type:Number,default:0},
        dislikes:{type:Number,default:0},
        comments:{type:Array,default:[]},
        owner:{type:Schema.Types.ObjectId,ref:"User"},
        duration:{type:Number, required:true},
        isPublished:{type:Boolean, dafault:true}
    },
    {
        timestamps:true
    }
)

export const Video = mongoose.model("Video",videoSchema);