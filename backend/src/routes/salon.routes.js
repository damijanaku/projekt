import { Router } from "express"
const router = Router();
import { createSalon, searchSalons, getCategories, getRegions, getMySalon, getAllSalons, updateSalon, deleteSalon, requireSalonOwner } from "../controllers/salon.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

router.get("/categories", getCategories);
router.get("/regions", getRegions);
router.post("/create-salon", authenticateToken, createSalon)
router.get("/get-categories", authenticateToken, getCategories)
router.get("/my-salon", authenticateToken, getMySalon)
router.get("/find-salon", authenticateToken, searchSalons)
router.get("/all", authenticateToken, getAllSalons)
router.patch("/:id", authenticateToken, requireSalonOwner, updateSalon)
router.delete("/:id", authenticateToken, requireSalonOwner, deleteSalon)


export default router;
