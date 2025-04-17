import express from 'express';
import { createVaccine, getVaccines, getVaccineById, updateVaccine, deleteVaccine } from '../controllers/vaccineController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.route('/create').post(protect, createVaccine);
router.route('/').get(protect, getVaccines);
router.route('/:id').get(protect, getVaccineById).put(protect, updateVaccine).delete(protect, deleteVaccine);

export default router;