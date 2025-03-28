import { useCallback, useState, useEffect } from 'react';
import AppointmentList from '../components/AppointmentList';
import AppointmentModal from '../components/AppointmentModal';
import { IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Appointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = useCallback(async () => {
  try {
    const response = await axiosInstance.get("/api/appointments", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(response.data);
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}, [token]);

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
