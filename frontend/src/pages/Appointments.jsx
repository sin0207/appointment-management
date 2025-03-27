import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import AppointmentList from '../components/AppointmentList';
import AppointmentModal from '../components/AppointmentModal';
import { IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Appointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (error) {
      alert('Failed to fetch appointments.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments();
  }

  const triggerRefresh = () => {
    fetchAppointments();
  }

  return (
    <div className="container mx-auto p-6">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <IconButton color="primary" onClick={handleCreateAppointment}>
          <AddIcon/> Create Appointment
        </IconButton>
      </Box>
      <AppointmentList 
        appointments={appointments} 
        setAppointments={setAppointments}  
        setModalOpen={setModalOpen}     
        setSelectedAppointment={setSelectedAppointment} 
        triggerRefresh={triggerRefresh}
      />
      <AppointmentModal
         modalOpen={modalOpen}
         setModalOpen={setModalOpen}
         onCloseFromParent={handleCloseModal}
         appointment={selectedAppointment}
       />
    </div>
  );
};

export default Appointments
