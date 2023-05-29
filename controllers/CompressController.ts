import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { s3 } from "../utils/aws";

export const compressUpload = multer({
    storage: multer.memoryStorage(),
  }).single("image");

  export const compressJPEG = (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    // Check if a file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const key = `${Date.now()}_${file.originalname}`;

  sharp(file.buffer)
    .resize(1000)
    .jpeg({quality: 80})
    .toBuffer()
    .then((buffer) => {
        s3.send(
            new PutObjectCommand({
              Bucket: "gama-scalable",
              Key: key,
              Body: buffer,
              ContentType: file.mimetype,
              ACL: "public-read",
            })
          );
        })
    .then(() => {
        return res.json({ message: "File compressed successfully", url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}`});
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: `Could not compress image, ${err}`, file  });
    });
};
