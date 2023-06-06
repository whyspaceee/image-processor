import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextFunction, Request, Response } from "express";
import { s3 } from "../utils/aws";

export async function getEditImageLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { imageId } = req.params;
    if (!imageId) return res.status(400).json({ error: "no filename given" });

    const command = new GetObjectCommand({
        Bucket: "gama-scalable",
        Key: imageId,
      }); 
    
    const url = await getSignedUrl(s3 as any, command as any, { expiresIn: 3600 })
    
    return res.json({ url });
  

  } catch (error) {
    next(error);
  }
}
