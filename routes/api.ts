import { Router } from "express";

import { cropImage } from "../controllers/CropController";
import { convertImage } from "../controllers/ConvertController";
import { getS3Link } from "../controllers/UploadController";
import { compressImage } from "../controllers/CompressController";
import { expressjwt } from "express-jwt";
import editMiddleware from "../middlewares/EditMiddleware";
import { getEditImageLink } from "../controllers/EditController";

const api = Router();

api.get(
  "/edit/:imageId",
  expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }),
  editMiddleware,
  getEditImageLink
);

api.post(
  "/upload/:imageId",
  getS3Link
);

api.post(
  "/crop/:imageId",
  expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }),
  editMiddleware,
  cropImage
);

api.post(
  "/convert/:imageId",
  expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }),
  editMiddleware,
  convertImage
);

api.post(
  "/compress/:imageId",
  expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
  }),
  editMiddleware,
  compressImage
);

api.get("/", (req, res) => {
  res.send("Hello World!");
});

export default api;
