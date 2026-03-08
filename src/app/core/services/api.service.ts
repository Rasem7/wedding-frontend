import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Client, CreateClientDto, Booking, CreateBookingDto,
  Vendor, Payment, DashboardStats, PagedResult, QueryParams
} from '../models';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

// ===== CLIENTS SERVICE =====
@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(params?: QueryParams): Observable<PagedResult<Client>> {
    let p = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) p = p.set(k, v);
      });
    }
    return this.http.get<PagedResult<Client>>(`${API}/clients`, { params: p });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${API}/clients/${id}`);
  }

  create(dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(`${API}/clients`, dto);
  }

  update(id: number, dto: Partial<CreateClientDto>): Observable<Client> {
    return this.http.put<Client>(`${API}/clients/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/clients/${id}`);
  }

  getByBudget(category: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${API}/clients/by-budget/${category}`);
  }
}

// ===== BOOKINGS SERVICE =====
@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  getAll(params?: QueryParams): Observable<PagedResult<Booking>> {
    let p = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v != null) p = p.set(k, v); });
    return this.http.get<PagedResult<Booking>>(`${API}/bookings`, { params: p });
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${API}/bookings/${id}`);
  }

  create(dto: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(`${API}/bookings`, dto);
  }

  updateStatus(id: number, status: string): Observable<Booking> {
    return this.http.patch<Booking>(`${API}/bookings/${id}/status`, { status });
  }

  getCalendarEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/bookings/calendar`);
  }
}

// ===== PAYMENTS SERVICE =====
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  getByBooking(bookingId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API}/payments/booking/${bookingId}`);
  }

  create(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(`${API}/payments`, payment);
  }
}

// ===== DASHBOARD SERVICE =====
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${API}/dashboard/stats`);
  }
}

// ===== VENDORS SERVICE =====
@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<Vendor[]> {
    let p = new HttpParams();
    if (category && category !== 'الكل') p = p.set('category', category);
    return this.http.get<Vendor[]>(`${API}/vendors`, { params: p });
  }

  getById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${API}/vendors/${id}`);
  }

  create(vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.post<Vendor>(`${API}/vendors`, vendor);
  }

  update(id: number, vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.put<Vendor>(`${API}/vendors/${id}`, vendor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/vendors/${id}`);
  }
}