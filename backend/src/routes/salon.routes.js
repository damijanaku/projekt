import { Router } from "express"
const router = Router();
import { createSalon, searchSalons, getCategories, getRegions, getMySalon, getAllSalons, updateSalon, deleteSalon, getSalonById, requireSalonOwner, uploadSalonGallery, deleteSalonGalleryImage, fetchImagesFromMyGallery, fetchImagesFromGallery } from "../controllers/salon.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

router.get("/categories", getCategories);
router.get("/regions", getRegions);
router.post("/create-salon", authenticateToken, createSalon)
router.get("/get-categories", authenticateToken, getCategories)
router.get("/my-gallery", authenticateToken, fetchImagesFromMyGallery)
router.get("/my-salon", authenticateToken, getMySalon)
router.get("/find-salon", authenticateToken, searchSalons)
router.get("/all", authenticateToken, getAllSalons)
router.get("/gallery/:id", authenticateToken, fetchImagesFromGallery)
router.post("/:id/gallery", authenticateToken, requireSalonOwner, uploadSalonGallery)
router.delete("/:id/gallery/:imageId", authenticateToken, requireSalonOwner, deleteSalonGalleryImage)
router.get("/:id", authenticateToken, getSalonById)
router.patch("/:id", authenticateToken, requireSalonOwner, updateSalon)
router.delete("/:id", authenticateToken, requireSalonOwner, deleteSalon)


export default router;
