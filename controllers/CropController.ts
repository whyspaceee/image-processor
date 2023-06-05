import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import sharp from "sharp";
import { s3 } from "../utils/aws";
import { streamToBuffer } from "../utils/streamToBuffer";

export const cropImage = async (req: Request, res: Response ) => {
  const tokenKey = String(req.auth?.key);
  const { imageId } = req.params; // Extract the imageId parameter from the request URL

  if (!tokenKey) {
    return res.status(400).json({ error: "invalid jwt" }); // If the format is not one of the allowed formats, return an error response
  }

  if (tokenKey !== imageId) {
    return res.status(400).json({ error: "invalid jwt" }); // If the format is not one of the allowed formats, return an error response
  }

    const { width, height } = req.query;

    const top = req.query.top || "0";
    const left = req.query.left || "0";

    if (!imageId) {
      return res.status(400).json({ error: "Missing imageid" });
    }

    if (!width || !height) {
      return res.status(400).json({ error: "Missing crop parameters" });
    }

    const crop = {
      left: parseInt(left.toString()),
      top: parseInt(top.toString()),
      width: parseInt(width.toString()),
      height: parseInt(height.toString()),
    };

    const object = await s3.send(
      new GetObjectCommand({
        Key: imageId,
        Bucket: "gama-scalable",
      })
    );

    if (!object.Body) {
      return res.status(400).json({ error: "image not found" });
    }

    const buffer = await streamToBuffer(object.Body);

    const metadata = await sharp(buffer).metadata();
    
    const originalname = imageId.split("_").slice(1).join("_");

    const key = `crop/${Date.now()}_${originalname}`;

    const croppedBuffer = await sharp(buffer).extract(crop).toBuffer();

    if (!croppedBuffer) {
      return res.status(400).json({ error: "unable to crop image" });
    }

    await s3.send(
      new PutObjectCommand({
        Key: key,
        Bucket: "gama-scalable",
        Body: croppedBuffer,
        ACL: "public-read",
        ContentType: metadata.format,
      })
    );

    return res.json({
      message: "File cropped successfully",
      url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}`,
    });
  
};
