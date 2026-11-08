import { Router } from "express"
const router = Router();
import authenticateToken from "../middleware/auth.middleware.js";
import {register, login, refresh, inviteNailArtist, acceptInvitation, createSalon} from "../controllers/user.controller.js"

router.post("/register", register),
router.post("/login", login)
router.get("/refresh", refresh)
router.post("/invite-nail-artist", authenticateToken, inviteNailArtist)
router.post("/accept-invitation", acceptInvitation)
router.post("/create-salon", authenticateToken, createSalon)


export default router;
