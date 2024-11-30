import React, { useState } from 'react';
import { useAppointmentStore } from '../../store/appointmentStore';
import type { Appointment } from '../../types/appointments';

interface CancellationModalProps {
  appointment: Appointment;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  appointment,
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Cita</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo de Cancelación
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              rows={3}
              required
              placeholder="Ingrese el motivo de la cancelación..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirmar Cancelación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AppointmentList: React.FC = () => {
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const appointments = useAppointmentStore((state) => state.getUpcomingAppointments());
  const cancelAppointment = useAppointmentStore((state) => state.cancelAppointment);

  const handleCancelAppointment = (reason: string) => {
    if (appointmentToCancel) {
      cancelAppointment(appointmentToCancel.id, reason);
      setAppointmentToCancel(null);
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className={`border rounded-lg p-4 ${
            appointment.status === 'cancelled' ? 'bg-red-50' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{appointment.customerName}</div>
              <div className="text-sm text-gray-500">
                Código: {appointment.customerCode}
              </div>
              <div className="text-sm text-gray-500">
                Teléfono: {appointment.customerPhone}
              </div>
              <div className="text-sm text-gray-500">
                Fecha: {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                Hora: {appointment.time}
              </div>
              {appointment.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notas:</span> {appointment.notes}
                </div>
              )}
              {appointment.status === 'cancelled' && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-red-600">
                    Cancelada
                  </span>
                  <p className="text-sm text-gray-500">
                    {appointment.cancellationReason}
                  </p>
                </div>
              )}
            </div>
            {appointment.status === 'scheduled' && (
              <button
                onClick={() => setAppointmentToCancel(appointment)}
                className="text-red-600 hover:text-red-800"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <p className="text-center text-gray-500">No hay citas programadas</p>
      )}

      {appointmentToCancel && (
        <CancellationModal
          appointment={appointmentToCancel}
          onConfirm={handleCancelAppointment}
          onClose={() => setAppointmentToCancel(null)}
        />
      )}
    </div>
  );
};