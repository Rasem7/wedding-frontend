import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Client, CreateClientDto, Booking, CreateBookingDto,
  Vendor, Payment, DashboardStats, PagedResult, QueryParams
} from '../models';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

//#region  CLIENTS SERVICE

// ===== CLIENTS SERVICE =====

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private http: HttpClient) {}

  // ✅ Get All (Pagination + Search)
  getAll(params?: QueryParams): Observable<Client[]> {
    let p = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) p = p.set(k, v);
      });
    }

    return this.http.get<Client[]>(`${API}/Clients/GetAll`, { params: p });
  }

  // ✅ Get All بدون pagination
  getAllWithoutPaging(): Observable<Client[]> {
    return this.http.get<Client[]>(`${API}/Clients/GetAllWithoutPaging`);
  }

  // ✅ Get By Id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/Clients/GetById`, {
      params: new HttpParams().set('id', id)
    });
  }

  // ✅ Create
  create(dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(`${API}/Clients/Create`, dto);
  }

  // ✅ Update
  update(id: number, dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(
      `${API}/Clients/Update`,
      dto,
      {
        params: new HttpParams().set('id', id)
      }
    );
  }

  // ✅ Delete 
  delete(id: number): Observable<any> {
    return this.http.post<any>(
      `${API}/Clients/Delete`,
      null,
      {
        params: new HttpParams().set('id', id)
      }
    );
  }
}

//#endregion

//#region BOOKINGS SERVICE
// ===== BOOKINGS SERVICE =====
@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  // ✅ GetAll (Paged + Filters)
  getAll(params?: QueryParams): Observable<Booking[]> {
    let p = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) p = p.set(k, v);
      });
    }

    return this.http.get<Booking[]>(`${API}/Bookings/GetAll`, { params: p });
  }

  // ✅ GetById
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/Bookings/GetById`, {
      params: new HttpParams().set('id', id)
    });
  }

  // ✅ Create
  create(dto: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(`${API}/Bookings/Create`, dto);
  }

  // ✅ Update Status (مهم 👇)
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.post<any>(
      `${API}/Bookings/UpdateStatus?id=${id}`,
      status,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ✅ Calendar
  getCalendarEvents(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${API}/Bookings/GetCalendar`, {
      params: new HttpParams()
        .set('year', year)
        .set('month', month)
    });
  }

  // ✅ بدون pagination (لو محتاجاه)
  getAllWithoutPaging(params?: QueryParams): Observable<Booking[]> {
    let p = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null) p = p.set(k, v);
      });
    }

    return this.http.get<Booking[]>(`${API}/Bookings/GetAllWithoutPaging`, { params: p });
  }
}
//#endregion


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
  return this.http.get<Vendor[]>(`${API}/serviceprovider`, { params: p });
}

getById(id: number): Observable<Vendor> {
  return this.http.get<Vendor>(`${API}/serviceprovider/${id}`);
}

create(vendor: Partial<Vendor>): Observable<Vendor> {
  return this.http.post<Vendor>(`${API}/serviceprovider`, vendor);
}

update(id: number, vendor: Partial<Vendor>): Observable<Vendor> {
  return this.http.put<Vendor>(`${API}/serviceprovider/${id}`, vendor);
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${API}/serviceprovider/${id}`);
}
}

//   getAll(category?: string): Observable<Vendor[]> {
//     let p = new HttpParams();
//     if (category && category !== 'الكل') p = p.set('category', category);
//     return this.http.get<Vendor[]>(`${API}/vendors`, { params: p });
//   }

//   getById(id: number): Observable<Vendor> {
//     return this.http.get<Vendor>(`${API}/vendors/${id}`);
//   }

//   create(vendor: Partial<Vendor>): Observable<Vendor> {
//     return this.http.post<Vendor>(`${API}/vendors`, vendor);
//   }

//   update(id: number, vendor: Partial<Vendor>): Observable<Vendor> {
//     return this.http.put<Vendor>(`${API}/vendors/${id}`, vendor);
//   }

//   delete(id: number): Observable<void> {
//     return this.http.delete<void>(`${API}/vendors/${id}`);
//   }
// }

