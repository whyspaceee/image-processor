import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { s3 } from "../utils/aws";

export const cropUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const cropImage = (req: Request, res: Response) => {
  // Retrieve the file from the 'file' field in the request body
  const file = req.file as Express.Multer.File;
  const { width, height, top, left } = req.body;

  // Check if a file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const key = `${Date.now()}_${file.originalname}`;
  const config = {
    jpeg: { quality: 80 },
    webp: { quality: 80 },
    png: { compressionLevel: 8 },
  };

  const crop = {
    left: left,
    top: top,
    width: width,
    height: height,
  };

  //crop image using sharp
  const image = sharp(file.buffer);
  image
    .extract(crop)
    .toBuffer()
    .then((buffer) => {
        s3.send(
        new PutObjectCommand({
          Bucket: "gama",
          Key: key,
          Body: buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        })
      );
    })
    .then(() => {
      return res.json({ message: "File cropped successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Could not crop image" });
    });
};
