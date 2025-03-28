const Appointment = require('../models/Appointment');
const NotFoundError = require("../errors/NotFoundError");

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      ...req.body
    });
    appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if(!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
}

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if(!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = 'Cancelled';
    appointment.save();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

const deleteAppointment  = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if(!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    await appointment.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { createAppointment, getAppointments, updateAppointment, cancelAppointment, deleteAppointment };
