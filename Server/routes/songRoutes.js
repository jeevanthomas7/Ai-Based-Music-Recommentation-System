import express from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, searchSongs } from "../controllers/songController.js";


const router = express.Router();

router.get("/", getAllSongs);
// router.post("/", createSong);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);


export default router;
