import { Request, Response } from "express";

// Function to get an S3 link for file upload
export const getS3Link = (req: Request, res: Response) => {
  // Retrieve the file from the 'file' field in the request body
  const file = req.file as Express.MulterS3.File;
  
  // Check if a file is provided
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Specify the name of your S3 bucket
  const bucket = "YOUR_BUCKET_NAME";

  // Generate the S3 link for the file using the bucket and key
  const url = `https://${bucket}.s3.amazonaws.com/${file.key}`;

  // Send a JSON response indicating successful file upload
  res.json({ message: "File uploaded successfully", url });
};
