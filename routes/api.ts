import { Router } from "express";
import { cropImage, } from "../controllers/CropController";
import { convertImage,  } from "../controllers/ConvertController";
import { getS3Link } from  "../controllers/UploadController";

const api = Router();

api.post("/upload/:imageId", getS3Link, )
api.post("/crop/:imageId", cropImage )
api.post("/convert/:imageId", convertImage )

api.get("/", (req, res) => {
    res.send("Hello World!");
});

export default api;

