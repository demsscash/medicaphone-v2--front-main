
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Appointment } from '../models/appointment';
import { Patient } from '../models/patient';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }


  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.apiUrl}/appointments`,
      appointment
    );
  }

    getAllAppointments(
      cabinetId: string,
      period: string,
      activeDate ?: Date,
      pageable ?: { page: number, size: number }
    ): Observable < Appointment[] > {
      let url = `${this.apiUrl}/appointments/cabinet/${cabinetId}/appointments?period=${period}`;

      let formattedDate = '';
      if(activeDate) {
        const year = activeDate.getFullYear();
        const month = String(activeDate.getMonth() + 1).padStart(2, '0');
        const day = String(activeDate.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
        url += `&activeDate=${formattedDate}`;
        console.log(formattedDate)
      }

    if(pageable) {
        url += `&page=${pageable.page}&size=${pageable.size}`;
      }
    return this.http.get<Appointment[]>(url);
    }
    deleteAppointment(appointmentId: string): Observable < string > {
      return this.http.delete<string>(`${this.apiUrl}/appointments/${appointmentId}`, { responseType: 'text' as 'json' });
    }

  }
