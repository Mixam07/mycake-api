import express from "express";
import multer from "multer";
import cakeController from "../controllers/cakeController";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
        const extension = file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
        if (!extension) {
            return cb(new Error("Please upload an image (jpg, jpeg, png)"));
        }
        cb(null, true);
    }
});

router.get("/cakes", cakeController.getCakes);

router.get("/cakes/:id", cakeController.getCakeById);

router.get("/cakes/:id_cake/photos/:id_photo", cakeController.getPhoto);

router.post("/cakes", upload.array("photos", 10), cakeController.createCake);

router.patch("/cakes/:id", upload.array("photos", 10), cakeController.updateCake);

router.delete("/cakes/:id", cakeController.deleteCake);

export default router;