import express from "express";
import { getPatientById, addPatient } from "../controllers/patientController.js";
import { getObservations, getConditions, addCondition, addObservation} from "../controllers/clinicalController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get/:id", getPatientById);
router.post("/add/", addPatient);
router.get("/getObservations/:id", getObservations);
router.post("/addObservations/", addObservation);
router.get("/getConditions/:id", getConditions);
router.post("/addConditions/", addCondition);

export default router;
