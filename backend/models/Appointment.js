const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  status: { type: String, enum: ['Created', 'Cancelled'], default: 'Created' },
  reason: { type: String },
  notes: { type: String }
}, { timestamps: true });

// validate no overlapping appointment
appointmentSchema.pre('save', async function (next) {
  const appointment = await this.constructor.findOne({
    appointmentDate: this.appointmentDate,
    appointmentTime: this.appointmentTime,
    _id: { $ne: this._id }
  });

  if (appointment) {
    throw new Error('Appointment already scheduled for this date and time');
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
