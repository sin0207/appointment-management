const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { createAppointment, getAppointments, updateAppointment, cancelAppointment, deleteAppointment } = require('../controllers/appointmentController');

const { expect } = chai;

describe('Appointment Controller Tests', () => {
  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
  });

  describe('createAppointment', () => {
    it('should create a new appointment successfully', async () => {
      const req = {
        user: { _id: new mongoose.Types.ObjectId() },
        body: { 
          appointmentDate: new Date('2025-12-31'), 
          appointmentTime: "14:00",
          reason: "Regular checkup",
          notes: "Patient requested morning slot if available"
        }
      };
      
      const createdAppointment = { 
        _id: new mongoose.Types.ObjectId(), 
        ...req.body, 
        patient: req.user._id,
        status: 'Created'
      };

      const createStub = sinon.stub(Appointment, 'create').resolves(createdAppointment);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();

      await createAppointment(req, res, next);

      expect(createStub.calledOnceWith({ patient: req.user._id, ...req.body})).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdAppointment)).to.be.true;
    });

    it('should call next with error if appointment overlaps', async () => {
      const req = {
        user: { _id: new mongoose.Types.ObjectId() },
        body: { appointmentDate: new Date('2025-12-31'), appointmentTime: "14:00" }
      };

      const error = new Error('Appointment already scheduled for this date and time');
      const createStub = sinon.stub(Appointment, 'create').throws(error);
      const next = sinon.spy();

      await createAppointment(req, {}, next);

      expect(next.calledWith(error)).to.be.true;
    });
  });
});

