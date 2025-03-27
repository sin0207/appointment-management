import AppointmentCard from './AppointmentCard';

const AppointmentList = ({ appointments, setAppointments, setModalOpen, setSelectedAppointment, triggerRefresh }) => {

  return (
    <div>
    {appointments.map((appointment) => (
      <AppointmentCard
        appointment={appointment}
        key={appointment.id}
        setModalOpen={setModalOpen}
        setSelectedAppointment={setSelectedAppointment}
        triggerRefresh={triggerRefresh}
      />
    ))}
    </div>
  );
};

export default AppointmentList;
