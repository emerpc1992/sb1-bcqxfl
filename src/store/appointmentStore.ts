import { create } from 'zustand';
import type { Appointment, AppointmentFormData } from '../types/appointments';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (data: AppointmentFormData) => Appointment;
  cancelAppointment: (id: string, reason: string) => void;
  getActiveAppointments: () => Appointment[];
  getTodayAppointments: () => Appointment[];
  getUpcomingAppointments: () => Appointment[];
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],

  addAppointment: (data) => {
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      ...data,
      status: 'scheduled',
      createdAt: new Date(),
    };

    set((state) => ({
      appointments: [...state.appointments, appointment],
    }));

    return appointment;
  },

  cancelAppointment: (id, reason) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: 'cancelled',
              cancelledAt: new Date(),
              cancellationReason: reason,
            }
          : appointment
      ),
    }));
  },

  getActiveAppointments: () => {
    return get().appointments.filter(
      (appointment) => appointment.status === 'scheduled'
    );
  },

  getTodayAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().appointments.filter(
      (appointment) =>
        appointment.status === 'scheduled' && appointment.date === today
    );
  },

  getUpcomingAppointments: () => {
    const today = new Date().toISOString().split('T')[0];
    return get()
      .appointments
      .filter(appointment => 
        appointment.status === 'scheduled' && 
        appointment.date >= today
      )
      .sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        return dateComparison !== 0 ? dateComparison : a.time.localeCompare(b.time);
      });
  },
}));