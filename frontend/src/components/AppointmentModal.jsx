import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Modal, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentModal = ({ modalOpen, setModalOpen, onCloseFromParent, appointment }) => {
  const { token } = useAuth();
  const initialDate = dayjs().add(1, 'day');
  const initialFormData = {
    appointmentDate: initialDate.toISOString(),
    appointmentTime: '',
    reason: '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  
  useEffect(() => {
    if (appointment) {
      setFormData(
        {
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          reason: appointment.reason || '',
          notes: appointment.notes || ''
        }
      );
    }
  }, [appointment]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const onClose = () => {
    setFormData(initialFormData);
    setModalOpen(false);
  }

  const handleSave = async () => {
    try {
      if (appointment) {
        await axiosInstance.put(`/api/appointments/${appointment._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post('/api/appointments', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onCloseFromParent();
      onClose();
    } catch (error) {
      alert('Failed to save appointment.');
    }
  }

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, appointmentDate: newDate.toISOString() });
  };

  const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';

    return `${hour}:${minute}`;
  });

  return (
    <Modal open={modalOpen} onClose={onClose}>
      <Box sx={{ width: 600, margin: '100px auto', padding: 3, backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom>{appointment ? 'Update Appointment' : 'Create Appointment'}</Typography>

        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={initialDate}
              onChange={handleDateChange}
              minDate={dayjs().add(0, 'day')}
              renderInput={(params) => <TextField {...params} sx={{ minWidth: 200 }} />}
            />
          </LocalizationProvider>
          
          <TextField
            select
            label="Time"
            value={formData.appointmentTime}
            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            sx={{ minWidth: 200 }}
          >
            {timeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {appointment ? 'Save Changes' : 'Create Appointment'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AppointmentModal;
