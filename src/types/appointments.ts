export interface Appointment {
  id: string;
  customerCode: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  notes: string;
  status: 'scheduled' | 'cancelled';
  createdAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface AppointmentFormData {
  customerCode: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  notes: string;
}