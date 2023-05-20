import { PutObjectCommand } from "@aws-sdk/client-s3";
import { on } from "events";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/aws";

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "gama",
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
        
    }),
    
});


export const multerUpload = upload.single("image");