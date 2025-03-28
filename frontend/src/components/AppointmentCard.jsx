import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Card, CardHeader, CardContent, IconButton, Typography, Box, Menu, MenuItem } from '@mui/material';
import { Edit as EditIcon, Close as CancelIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentCard = ({ appointment, setModalOpen, setSelectedAppointment, triggerRefresh }) => {
  const { token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
    handleCloseMenu();
  };

  const handleCancel = async (id) => {
    try {
      await axiosInstance.post(`/api/appointments/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      handleCloseMenu();
      triggerRefresh();
    } catch (error) {
      alert('Failed to cancel appointment.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      handleCloseMenu();
      triggerRefresh();
    } catch (error) {
      alert('Failed to delete appointment.');
    }
  };

  const appointmentDate = dayjs(appointment.appointmentDate);
  const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
  const appointmentDateTime = appointmentDate.hour(hours).minute(minutes);
  const isPastAppointment = appointmentDateTime.isBefore(dayjs());
  const isActive = (appointment.status === 'Created' && !isPastAppointment);

  return (
    <Card sx={{ margin: '20px auto', boxShadow: 3 }}>
      <CardHeader
        title={`Appointment at: ${new Date(appointment.appointmentDate).toISOString().split('T')[0]} ${appointment.appointmentTime}`}
        subheader={`Status: ${appointment.status}`}
        action={ 
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              { isActive ? (
                  <>
                    <MenuItem onClick={handleEditClick}>
                      <EditIcon /> Update
                    </MenuItem>
                    <MenuItem sx={{ color: 'orange' }} onClick={() => handleCancel(appointment._id)}>
                      <CancelIcon /> Cancel
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem sx={{ color: 'red' }} onClick={() => handleDelete(appointment._id)}>
                    <DeleteIcon /> Delete
                  </MenuItem>
                )
              }
            </Menu>
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <strong>Reason:</strong> {appointment.reason}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Notes:</strong> {appointment.notes}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;

