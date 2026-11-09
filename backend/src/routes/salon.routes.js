import { Router } from "express"
const router = Router();
import { createSalon, searchSalons, getCategories, getMySalon, getAllSalons } from "../controllers/salon.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

router.get("/categories", getCategories);
router.post("/create-salon", authenticateToken, createSalon)
router.get("/get-categories", authenticateToken, getCategories)
router.get("/my-salon", authenticateToken, getMySalon)
router.get("/find-salon", authenticateToken, searchSalons)
router.get("/all", authenticateToken, getAllSalons)


export default router;
