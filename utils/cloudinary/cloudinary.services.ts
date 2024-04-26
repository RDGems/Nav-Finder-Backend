import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 180000
});

// upload to cloudinary function
export const uploadToCloudinary = async (localPath: any) => {
    try {
        if (!localPath) return;
        const result = await cloudinary.uploader.upload(localPath, { resource_type: "auto" });
        fs.unlinkSync(localPath); // delete the local file
        return result.url;
    } catch (error: any) {
        console.log(error);
        console.log("error while uploading");
        return null;
    }
}