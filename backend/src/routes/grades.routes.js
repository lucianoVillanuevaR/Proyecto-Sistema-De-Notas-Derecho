import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { NotasController } from "../controllers/user.controller.js";
import { updateGradeValidation, createGradeValidation } from "../validations/grades.validation.js";

const router = Router();
const controller = new NotasController();

const validateGradeCreate = (req, res, next) => {
  const { error } = createGradeValidation.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      error: "Error de validación", 
      details: errors 
    });
  }
  next();
};

const validateGradeUpdate = (req, res, next) => {
  const { error } = updateGradeValidation.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      error: "Error de validación", 
      details: errors 
    });
  }
  next();
};

router.get("/", authMiddleware, checkRole("profesor", "admin"), controller.getAllNotas.bind(controller));
router.post("/", authMiddleware, checkRole("profesor", "admin"), validateGradeCreate, controller.createNota.bind(controller));
router.get("/:id", authMiddleware, controller.getNotaById.bind(controller));
router.patch("/:id", authMiddleware, checkRole("profesor", "admin"), validateGradeUpdate, controller.updateNota.bind(controller));
router.delete("/:id", authMiddleware, checkRole("profesor", "admin"), controller.deleteNota.bind(controller));
export default router;
