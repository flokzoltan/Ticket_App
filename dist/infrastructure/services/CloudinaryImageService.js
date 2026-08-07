"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryImageService = void 0;
const cloudinary_1 = require("cloudinary");
class CloudinaryImageService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async compressAndUpload(buffer) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'szerviz_tickets',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ],
            }, (error, result) => {
                if (error || !result)
                    return reject(error);
                resolve(result.secure_url);
            });
            uploadStream.end(buffer);
        });
    }
}
exports.CloudinaryImageService = CloudinaryImageService;
