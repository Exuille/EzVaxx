import Appointment from '../models/appointmentModel.js';
import Vaccine from '../models/vaccineModel.js';
import catchAsync from '../utils/catchAsync.js';

export const createAppointment = catchAsync(async (req, res) => {
    const { vaccine, dateTime } = req.body;
    const patient = req.user?.id;

    if (!patient) {
        return res.status(401).json({
            status: "fail",
            message: "Please login first"
        });
    }

    if (!dateTime) {
        return res.status(400).json({
            status: "fail",
            message: "Please enter a date first"
        });
    }

    if (!vaccine) {
        return res.status(400).json({
            status: "fail",
            message: "Please select a vaccine"
        });
    }

    const existingVaccine = await Vaccine.findOne({ name: vaccine });
    if (!existingVaccine) {
        return res.status(404).json({
            status: 'fail',
            message: 'Vaccine not found',
        });
    }

    const existingAppointment = await Appointment.findOne({ dateTime, status: 'pending' });
    if (existingAppointment) {
        return res.status(409).json({
            status: "fail",
            message: "This time slot is already taken. Please choose another."
        });
    }

    const newAppointment = await Appointment.create({ patient, vaccine: existingVaccine._id, dateTime, status: 'pending' });

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

export const getMyAppointments = catchAsync(async (req, res) => {
    const appointments = await Appointment.find({ patient: req.user.id });

    if (!appointments) {
        return res.status(404).json({ status: 'fail', message: 'No appointments found' });
    }

    res.status(200).json({ status: 'success', results: appointments.length, data: { appointments } });
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
