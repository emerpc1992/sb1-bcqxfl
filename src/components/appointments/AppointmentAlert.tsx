import React, { useEffect, useState, useCallback } from 'react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { Bell } from 'lucide-react';

export const AppointmentAlert: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const appointments = useAppointmentStore((state) => state.getTodayAppointments());

  const checkUpcomingAppointments = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const hasUpcomingAppointment = appointments.some(appointment => {
      const [hours, minutes] = appointment.time.split(':').map(Number);
      const appointmentTime = hours * 60 + minutes;
      const timeDiff = appointmentTime - currentTime;
      return timeDiff > 0 && timeDiff <= 30; // Alert for appointments within next 30 minutes
    });

    setShowAlert(hasUpcomingAppointment);
  }, [appointments]);

  useEffect(() => {
    checkUpcomingAppointments();
    const interval = setInterval(checkUpcomingAppointments, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkUpcomingAppointments]);

  if (!showAlert) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-pink-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
      <Bell className="h-5 w-5" />
      <span>¡Tienes citas próximas!</span>
    </div>
  );
};