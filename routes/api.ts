import { Router } from "express";
import { cropImage, cropUpload } from "../controllers/CropController";
import { getS3Link } from "../controllers/upload/getS3Link";
import { multerUpload } from "../controllers/upload/multerUpload";

const api = Router();

api.post("/upload", multerUpload, getS3Link, )
api.post("/crop", cropUpload, cropImage )

export default api;

