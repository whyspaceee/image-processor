import { Router } from "express";
import { cropImage, cropUpload } from "../controllers/CropController";
import { convertImage, convertUpload } from "../controllers/ConvertController";
import { getS3Link, multerUpload } from  "../controllers/UploadController";
import { compressJPEG, compressUpload } from "../controllers/CompressController";

const api = Router();

api.post("/upload", multerUpload, getS3Link, )
api.post("/crop", cropUpload, cropImage )
api.post("/convert", convertUpload, convertImage )
api.post("/compress", compressUpload, compressJPEG )

api.get("/", (req, res) => {
    res.send("Hello World!");
});

export default api;

