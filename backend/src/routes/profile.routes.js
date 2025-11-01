import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPublicProfile,
  getPrivateProfile,
  updatePrivateProfile,
  deletePrivateProfile,
} from "../controllers/profile.controller.js";
import { validarUpdateProfile } from "../validations/usuario.validation.js"; 
const router = Router();
router.get("/public", getPublicProfile);
router.get("/private", authMiddleware, getPrivateProfile);
router.patch("/private", authMiddleware, validarUpdateProfile, updatePrivateProfile);
router.delete("/private", authMiddleware, deletePrivateProfile);
export default router;