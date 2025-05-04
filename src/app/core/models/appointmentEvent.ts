import { Appointment } from "./appointment";

export interface AppointmentEvent {
    type: 'CREATED' | 'UPDATED' | 'DELETED';
    data: Appointment;
}