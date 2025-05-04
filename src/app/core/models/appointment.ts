export interface Appointment {
  id?: string;
  subject: string;
  dateTime: Date;
  note?: string | null;
  appointmentType: string;
  patientId: string;
  cabinetId: string;
  patientName?: string;
  patientPhone?: string;
  appointmentStatus?: string;
  showMenu?: boolean;
  showStatusMenu?: boolean;
}
