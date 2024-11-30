import React, { useState } from 'react';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { AppointmentList } from '../components/appointments/AppointmentList';

export const Appointments: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Citas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          {showForm ? 'Cancelar' : 'Nueva Cita'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agendar Nueva Cita</h3>
            <AppointmentForm onSuccess={() => setShowForm(false)} />
          </div>
        )}

        <div className={showForm ? "lg:col-span-1" : "lg:col-span-2"}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Próximas Citas</h3>
            <AppointmentList />
          </div>
        </div>
      </div>
    </div>
  );
};