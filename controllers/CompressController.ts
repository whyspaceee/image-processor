import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { s3 } from "../utils/aws";
import { streamToBuffer } from "../utils/streamToBuffer";
import sharp from "sharp";

export const compressImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageId } = req.params; // Extract the imageId parameter from the request URL
    const format = req.query.format?.toString(); // Extract the format query parameter from the request URL
    const quality = parseInt(req.query.quality?.toString() || "80");

    if (format && !(format in sharp.format)) {
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

    const buffer = await streamToBuffer(stream); //

    const metadata = await sharp(buffer).metadata();

    const compressedBuffer = await sharp(buffer)
      .toFormat((format as keyof sharp.FormatEnum) || metadata.format, {
        quality: quality,
      })
      .toBuffer();

    if (!compressedBuffer) {
      return res.status(400).json({ error: "error" }); // If the conversion fails, return an error response
    }

    const split = imageId.split("_").slice(1).join("_");
    const key = `${Date.now()}_${split.replace(/\.[^/.]+$/, "")}.${
      format || metadata.format
    }`; // Generate a unique key for the converted image

    // Upload the converted image buffer to the S3 bucket with the generated key
    await s3.send(
      new PutObjectCommand({
        Bucket: "gama-scalable",
        Key: key,
        Body: compressedBuffer,
        ContentType: `image/${format || metadata.format}`,
        ACL: "public-read",
      })
    );

    return res.json({
      message: "File compressed successfully",
      url: `https://gama-scalable.s3.ap-southeast-1.amazonaws.com/${key}`, // Return the URL of the converted image
    });
  } catch (err) {
    next(err);
  }
};
