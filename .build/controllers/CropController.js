"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cropImage = exports.cropUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const aws_1 = require("../utils/aws");
exports.cropUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
}).single("image");
const cropImage = (req, res) => {
    // Retrieve the file from the 'file' field in the request body
    const file = req.file;
    const { width, height, top, left } = req.body;
    // Check if a file is provided
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const key = `${Date.now()}_${file.originalname}`;
    if (!width || !height || !top || !left) {
        return res.status(400).json({ error: "Missing crop parameters" });
    }
    const crop = {
        left: parseInt(left),
        top: parseInt(top),
        width: parseInt(width),
        height: parseInt(height),
    };
    //crop image using sharp
    (0, sharp_1.default)(file.buffer)
        .extract(crop)
        .toBuffer()
        .then((buffer) => {
        aws_1.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: "gama-scalable",
            Key: key,
            Body: buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        }));
    })
        .then(() => {
        return res.json({ message: "File cropped successfully", url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}` });
    })
        .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: `Could not crop image, ${err}`, file });
    });
};
exports.cropImage = cropImage;
