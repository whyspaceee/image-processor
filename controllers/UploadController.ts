import { Request, Response } from "express";
import { s3 } from "../utils/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { sign } from "jsonwebtoken";

// Function to get an S3 link for file upload
export const getS3Link = (req: Request, res: Response) => {
  // Retrieve the file from the 'file' field in the request body
  const { imageId } = req.params;

  if (!imageId) return res.status(400).json({ error: "no filename given" });

  const { contentType } = req.query;

  const key = `${Date.now()}_${imageId}`;

  const command = new PutObjectCommand({
    Bucket: "gama-scalable",
    Key: key,
    ContentType: contentType?.toString(),
  });

  getSignedUrl(s3 as any, command as any, { expiresIn: 3600 })
    .then((url) => {
      const token = sign({ key }, process.env.JWT_SECRET as string, {
        expiresIn: "30m",
      });
      return res.json({ url, key, token });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};
