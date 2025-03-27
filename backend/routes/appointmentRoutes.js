const express = require('express');
const { createAppointment, getAppointments, updateAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, updateAppointment);
router.post('/:id/cancel', protect, cancelAppointment)

module.exports = router;
