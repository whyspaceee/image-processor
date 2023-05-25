"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CropController_1 = require("../controllers/CropController");
const UploadController_1 = require("../controllers/UploadController");
const api = (0, express_1.Router)();
api.post("/upload", UploadController_1.multerUpload, UploadController_1.getS3Link);
api.post("/crop", CropController_1.cropUpload, CropController_1.cropImage);
api.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.default = api;
