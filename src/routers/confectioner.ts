import express from "express";
import multer from "multer";
import confectionerController from "../controllers/confectionerController";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req: any, file: any, cb: any) {
        const extension = file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
        if (!extension) {
            return cb(new Error('Please upload an image (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

router.get("/confectioners", confectionerController.getConfectioners);

router.get("/confectioners/:id/photo", confectionerController.getPhoto);

router.post("/confectioners/registration", confectionerController.registration);

router.patch("/confectioners/:id", upload.single('photo'), confectionerController.updateConfectioner);

router.delete("/confectioners/:id", confectionerController.deleteConfectioner);

export default router;