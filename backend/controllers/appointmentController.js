const Appointment = require('../models/Appointment');
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      ...req.body
    });

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

const findAppointment = async (appointmentId, user) => {
  const appointment = await Appointment.findById(appointmentId);
  if(!appointment) {
    throw new NotFoundError('Appointment not found');
  }

  if(appointment.patient.toString() !== user.id) {
    throw new ForbiddenError('You cannot access this appointment');
  }

  return appointment;
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await findAppointment(req.params.id, req.user);

    if(appointment.status === 'Cancelled') {
      throw new Error('Cancelled appointment cannot be updated');
    }

    appointment.set(req.body);
    appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
}

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await findAppointment(req.params.id, req.user);

    if(appointment.status === 'Cancelled') {
      throw new Error('Cancelled appointment cannot be updated');
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
    const appointment = await findAppointment(req.params.id, req.user);

    if(appointment.status === 'Created') {
      throw new Error('Created appointment cannot be deleted');
    }

    await appointment.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { createAppointment, getAppointments, updateAppointment, cancelAppointment, deleteAppointment };
