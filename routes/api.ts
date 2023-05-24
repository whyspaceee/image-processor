import { Router } from "express";
import { cropImage, cropUpload } from "../controllers/CropController";
import { getS3Link, multerUpload } from  "../controllers/UploadController";

const api = Router();

api.post("/upload", multerUpload, getS3Link, )
api.post("/crop", cropUpload, cropImage )

api.get("/", (req, res) => {
    res.send("Hello World!");
});

export default api;

