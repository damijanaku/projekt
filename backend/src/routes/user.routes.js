import { Router } from "express"
const router = Router();
import authenticateToken from "../middleware/auth.middleware.js";
import {register, login, refresh, inviteNailArtist, acceptInvitation, updateUser, deleteUser} from "../controllers/user.controller.js"

router.post("/register", register),
router.post("/login", login)
router.get("/refresh", refresh)
router.post("/invite-nail-artist", authenticateToken, inviteNailArtist)
router.post("/accept-invitation", acceptInvitation)
router.patch("/me", authenticateToken, updateUser)
router.delete("/me", authenticateToken, deleteUser)
router.patch("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken, deleteUser)


export default router;
