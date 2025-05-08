import express from "express";
import multer from "multer";
import buyerController from "../controllers/buyerController";

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

router.get("/buyers", buyerController.getBuyers);

router.get("/buyers/:id", buyerController.getBuyerById);

router.get("/buyers/:id/photo", buyerController.getPhoto);

router.post("/buyers/registration", buyerController.registration);

router.patch("/buyers/:id", upload.single("photo"), buyerController.updateBuyer);

router.delete("/buyers/:id", buyerController.deleteBuyer);

export default router;