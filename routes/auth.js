import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

// This is same as app.post('/login', login) but instead of app we are using router.
router.post("/login", login);

export default router;
