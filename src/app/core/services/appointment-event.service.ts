import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppointmentEvent } from '../models/appointmentEvent';

@Injectable({
  providedIn: 'root'
})
export class AppointmentEventService {
  private eventSource: EventSource | null = null;
  private appointmentSubject = new Subject<AppointmentEvent>();

  connect(cabinetId: string) {
    this.disconnect();
    this.eventSource = new EventSource(`${environment.apiUrl}/appointments/updates/${cabinetId}`);

    this.eventSource.addEventListener('APPOINTMENT_CREATED', (event) => {
      const appointmentData = JSON.parse(event.data);
      this.appointmentSubject.next({
        type: 'CREATED',
        data: appointmentData
      });
    });

    this.eventSource.addEventListener('APPOINTMENT_UPDATED', (event) => {
      const appointmentData = JSON.parse(event.data);
      this.appointmentSubject.next({
        type: 'UPDATED',
        data: appointmentData
      });
    });
    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.reconnect(cabinetId);
    };
  }
  getAppointmentUpdates() {
    return this.appointmentSubject.asObservable();
  }

  private reconnect(cabinetId: string) {
    setTimeout(() => {
      this.disconnect();
      this.connect(cabinetId);
    }, 5000);
  }
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}