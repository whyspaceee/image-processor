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
  

  const key = `crop/${Date.now()}_${file.originalname}`;

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
  sharp(file.buffer)
    .extract(crop)
    .toBuffer()
    .then((buffer) => {
        return s3.send(
        new PutObjectCommand({
          Key: key,
          Bucket: "gama-scalable",
          Body: buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        })
      );
    })
    .then(() => {
      return res.json({ message: "File cropped successfully", url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}`});
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: `Could not crop image, ${err}`, file  });
    });
};
