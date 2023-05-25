import { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/aws";

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "gama-scalable",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `upload/${Date.now()}_${file.originalname}`);
    },
  }),
});

export const multerUpload = upload.single("image");

// Function to get an S3 link for file upload
export const getS3Link = (req: Request, res: Response) => {
  // Retrieve the file from the 'file' field in the request body
  const file = req.file as Express.MulterS3.File;

  // Check if a file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Send a JSON response indicating successful file upload
  res.json({ message: "File uploaded ! ", url: file.location });
};
