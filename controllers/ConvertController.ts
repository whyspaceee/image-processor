import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { s3 } from "../utils/aws";

export const convertUpload = multer({
    storage: multer.memoryStorage(),
  }).single("image");

export const convertImage = (req: Request, res: Response) => {
  // Retrieve the file from the 'file' field in the request body
  const file = req.file as Express.Multer.File;
  const { width, height, top, left } = req.body;

  // Check if a file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const key = `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}.jpeg`;
  const config = {
    jpeg: { quality: 80 },
    webp: { quality: 80 },
    png: { compressionLevel: 8 },
  };


  //convert image using sharp
  const image = sharp(file.buffer).toFormat("jpeg");
  image
    .toBuffer()
    .then((buffer) => {
        s3.send(
        new PutObjectCommand({
          Bucket: "gama",
          Key: key,
          Body: buffer,
          ContentType: "file/jpeg",
          ACL: "public-read",
        })
      );
    })
    .then(() => {
      return res.json({ message: "File converted successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Could not convert image" });
    });
};
