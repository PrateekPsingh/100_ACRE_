import express from "express";
import {
 initiatechat
} from "../controllers/initiate.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, addChat);

export default router;
