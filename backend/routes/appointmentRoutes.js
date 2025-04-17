import express from 'express';
import {createAppointment, cancelAppointment, getAppointmentById, getAppointments, updateAppointment} from '../controllers/appointmentController.js';
import {protect} from '../controllers/authController.js';

const router = express.Router();

router.route("/create").post(protect, createAppointment);
router.route("/cancel").put(protect, cancelAppointment);
router.route("/get/:id").get(protect, getAppointmentById);
router.route("/get").get(protect, getAppointments);
router.route("/update").put(protect, updateAppointment);

export default router;