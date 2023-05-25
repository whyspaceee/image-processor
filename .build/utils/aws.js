"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const globalForAWS = global;
console.log(process.env.S3_KEY, process.env.S3_SECRET);
// Configure AWS SDK with your credentials
const s3 = new client_s3_1.S3Client({
    forcePathStyle: false,
    region: "ap-southeast-1",
    credentials: {
        secretAccessKey: process.env.S3_SECRET,
        accessKeyId: process.env.S3_KEY,
    }
});
exports.s3 = s3;
if (process.env.NODE_ENV !== 'production') {
    globalForAWS.s3 = s3;
}
