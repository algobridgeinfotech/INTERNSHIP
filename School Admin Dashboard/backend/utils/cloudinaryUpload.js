import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, folder = "student-dashboard") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
