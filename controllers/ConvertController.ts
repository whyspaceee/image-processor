import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import sharp, { FormatEnum } from "sharp";
import { s3 } from "../utils/aws";
import { streamToBuffer } from "../utils/streamToBuffer";
import { NextFunction } from "connect";

export const convertImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { imageId } = req.params; // Extract the imageId parameter from the request URL

    const format = req.query.format?.toString()// Extract the format query parameter from the request URL

    if (!format) {
      return res.status(400).json({ error: "no format given" }); // If no format is provided, return an error response
    } 

    if (!(format in sharp.format)) {
      return res.status(400).json({ error: "invalid format" }); // If the format is not one of the allowed formats, return an error response
    }
    

    // Fetch the image file from the S3 bucket using the imageId
    const data = await s3.send(
      new GetObjectCommand({
        Key: imageId,
        Bucket: "gama-scalable",
      })
    );

    const stream = data.Body; // Get the image data stream from the fetched object

    if (!stream) {
      return res.status(400).json({ error: "error" }); // If the stream is empty, return an error response
    }

    const buffer = await streamToBuffer(stream); // Convert the stream to a buffer

    // Convert the image buffer to the requested format (jpeg, png, webp)
    const convertedBuffer = await sharp(buffer).toFormat(format as keyof sharp.FormatEnum).toBuffer();

    if (!convertedBuffer) {
      return res.status(400).json({ error: "error" }); // If the conversion fails, return an error response
    }

    const split = imageId.split("_");
    const originalname = split.slice(1).join("_");
    const key = `${Date.now()}_${originalname.replace(
      /\.[^/.]+$/,
      ""
    )}.${format}`; // Generate a unique key for the converted image

    // Upload the converted image buffer to the S3 bucket with the generated key
    await s3.send(
      new PutObjectCommand({
        Bucket: "gama-scalable",
        Key: key,
        Body: convertedBuffer,
        ContentType: `image/${format}`,
        ACL: "public-read",
      })
    );

    return res.json({
      message: "File converted successfully",
      url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}`, // Return the URL of the converted image
    });
  } catch (err) {
    next(err); // If an error occurs, pass it to the error handling middleware
  }
};
