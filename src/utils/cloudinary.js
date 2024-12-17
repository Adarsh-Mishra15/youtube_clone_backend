import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async function(localFilePath){
    try {
        // check the file is uploaded or not
        if(!localFilePath) return null
        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        console.log("Successfully uploaded file", res.url)
        //unlink file from local
        fs.unlink(localFilePath,(err)=>{
            if(err){
                console.log("Error in deleting file")
            }
            else{
                console.log("file delted successfully")
            }
        })
        return res;
    } catch (error) {
        // remove the locally saved temporary file as upload operation got failed
        fs.unlink(localFilePath,
            (error)=>{
                if(error)
                {
                    console.log("Error in deleting file")
                }
                else{
                    console.log("file delted successfully")
                }
            }
        )
        console.log("unable to configure cloudinary")
        return null;
    }
}

export {uploadOnCloudinary}