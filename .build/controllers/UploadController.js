"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Link = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = require("../utils/aws");
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.s3,
        bucket: "gama-scalable",
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `upload/${Date.now()}_${file.originalname}`);
        },
    }),
});
exports.multerUpload = upload.single("image");
// Function to get an S3 link for file upload
const getS3Link = (req, res) => {
    // Retrieve the file from the 'file' field in the request body
    const file = req.file;
    // Check if a file is provided
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // Send a JSON response indicating successful file upload
    res.json({ message: "File uploaded ! ", url: file.location });
};
exports.getS3Link = getS3Link;
