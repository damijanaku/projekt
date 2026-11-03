import { Router } from "express"
const router = Router();
import authenticateToken from "../middleware/auth.middleware.js";
import {register, login, refresh} from "../controllers/user.controller.js"

router.post("/register", register),
router.post("/login", login)
router.get("/refresh", authenticateToken, refresh)


export default router;