// routes/NoticeRoutes.js
import express from "express";
import NoticeController from "../controllers/NoticeControllers.js"; // add `.js` extension if using ES modules

const router = express.Router();

router.get("/", NoticeController.getAllNotices);
router.post("/", NoticeController.addNotices);
router.get("/:id", NoticeController.getById);
router.put("/:id", NoticeController.updateNotice);
router.delete("/:id", NoticeController.deleteNotice);

export default router;
