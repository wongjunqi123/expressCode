import express from "express";
import VideoController from "../controllers/video.controller";

const router = express.Router();

router.get("/", VideoController.getVideos);
router.get("/:id", VideoController.getVideo);

export default router;
