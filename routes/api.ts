import { Router } from "express";
import multer from "multer";
import { getS3Link } from "../controllers/getS3Link";
import { multerUpload } from "../controllers/multerUpload";

const routes = Router();

routes.post("/upload", multerUpload, getS3Link, )

export default routes;

