export interface VideoConsultation {
  id: string;
  appointmentId: string;
  meetingId: string;
  topic: string;
  startTime: string;
  durationMinutes: number;
  joinUrl: string;
  status: string;
  doctorName: string;
}