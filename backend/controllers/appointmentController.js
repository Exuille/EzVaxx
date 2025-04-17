import Appointment from '../models/appointmentModel.js';
import catchAsync from '../utils/catchAsync.js';

export const createAppointment = catchAsync(async (req, res) => {
    const { datetime } = req.body;
    const patient = req.user?.id;

    if (!patient) {
        return res.status(401).json({
            status: "fail",
            message: "Please login first"
        });
    }

    if (!datetime) {
        return res.status(400).json({
            status: "fail",
            message: "Please enter a date first"
        });
    }

    const newAppointment = await Appointment.create({ patient, datetime });

    res.status(201).json({
        status: "success",
        data: {
            appointment: newAppointment
        }
    });
});

export const cancelAppointment = catchAsync(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin' && appointment.patient.toString() !== req.user.id) {
        return res.status(403).json({ status: 'fail', message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ status: 'success', data: { appointment } });
});


export const getAppointments = catchAsync(async (req, res) => {
    let appointments;
    if (req.user.role === 'admin') {
        appointments = await Appointment.find().populate('patient');
    } else {
        appointments = await Appointment.find({ patient: req.user.id });
    }

    res.status(200).json({ status: 'success', results: appointments.length, data: { appointments } });
});


export const getAppointmentById = catchAsync(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id).populate('patient');

    if (!appointment) {
        return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin' && appointment.patient._id.toString() !== req.user.id) {
        return res.status(403).json({ status: 'fail', message: 'Not authorized to view this appointment' });
    }

    res.status(200).json({ status: 'success', data: { appointment } });
});


export const updateAppointment = catchAsync(async (req, res) => {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updated) {
        return res.status(404).json({ status: 'fail', message: 'Appointment not found' });
    }

    res.status(200).json({ status: 'success', data: { appointment: updated } });
});
