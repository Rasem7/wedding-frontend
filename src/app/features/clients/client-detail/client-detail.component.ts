import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService, BookingService } from '../../../core/services/api.service';
import { Client, Booking } from '../../../core/models';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="detail-section">
      <div class="detail-header">
        <button class="back-btn" routerLink="/clients">← رجوع للعملاء</button>

        @if (loading()) {
          <div class="loading">جاري التحميل...</div>
        } @else if (client()) {
          <div class="client-hero">
            <div class="client-avatar-lg">{{ client()!.groomName[0] }}</div>
            <div>
              <h2>{{ client()!.groomName }} & {{ client()!.brideName }}</h2>
              <p>{{ client()!.email }}</p>
            </div>
            <span class="budget-badge" [class]="client()!.budgetCategory.toLowerCase()">
              {{ budgetLabel(client()!.budgetCategory) }}
            </span>
          </div>

          <!-- Info Cards -->
          <div class="info-grid">
            <div class="info-card">
              <div class="info-label">موبايل العريس</div>
              <div class="info-val">{{ client()!.groomPhone }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">موبايل العروسة</div>
              <div class="info-val">{{ client()!.bridePhone || '—' }}</div>
            </div>
            <div class="info-card">
              <div class="info-label">الميزانية</div>
              <div class="info-val gold">{{ client()!.budget | number }} جنيه</div>
            </div>
            <div class="info-card">
              <div class="info-label">العنوان</div>
              <div class="info-val">{{ client()!.address || '—' }}</div>
            </div>
          </div>

          <!-- Bookings -->
          <div class="bookings-section">
            <h3>الحجوزات</h3>
            @if (bookings().length === 0) {
              <div class="empty">لا يوجد حجوزات لهذا العميل</div>
            }
            @for (b of bookings(); track b.id) {
              <div class="booking-row">
                <div>
                  <div class="b-date">📅 {{ b.weddingDate | date:'dd/MM/yyyy' }}</div>
                  <div class="b-venue">📍 {{ b.venue }}</div>
                </div>
                <div>
                  <div class="b-guests">{{ b.guestCount }} ضيف</div>
                </div>
                <span class="status-badge" [class]="b.status.toLowerCase()">{{ statusLabel(b.status) }}</span>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .detail-section { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .back-btn {
      background: rgba(201,168,76,0.12); color: #8B6914; border: none;
      border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer;
      font-family: 'Tajawal', sans-serif; font-size: 0.9rem; margin-bottom: 1.5rem; display: inline-block;
    }
    .loading { padding: 3rem; text-align: center; color: #7A6040; }
    .client-hero {
      display: flex; align-items: center; gap: 1.2rem;
      background: #FFFDF8; border: 1px solid rgba(201,168,76,0.15);
      border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .client-avatar-lg {
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #C9A84C, #E8C87A);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; font-weight: 700; color: white; flex-shrink: 0;
    }
    .client-hero h2 { font-family: 'Amiri', serif; font-size: 1.5rem; color: #1A1208; }
    .client-hero p { color: #7A6040; font-size: 0.9rem; }
    .budget-badge {
      margin-right: auto; padding: 0.3rem 0.9rem; border-radius: 50px;
      font-size: 0.82rem; font-weight: 700;
    }
    .budget-badge.economical { background: rgba(45,138,78,0.12); color: #2D8A4E; }
    .budget-badge.standard   { background: rgba(26,86,196,0.12); color: #1A56C4; }
    .budget-badge.premium    { background: rgba(201,168,76,0.15); color: #8B6914; }
    .budget-badge.luxury     { background: rgba(197,115,122,0.12); color: #C5373A; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
    .info-card { background: #FFFDF8; border: 1px solid rgba(201,168,76,0.12); border-radius: 12px; padding: 1rem; }
    .info-label { font-size: 0.75rem; color: #7A6040; font-weight: 600; text-transform: uppercase; margin-bottom: 0.3rem; }
    .info-val { font-size: 0.95rem; color: #1A1208; font-weight: 600; }
    .info-val.gold { color: #8B6914; }

    .bookings-section h3 { font-family: 'Amiri', serif; font-size: 1.2rem; color: #1A1208; margin-bottom: 1rem; }
    .empty { padding: 2rem; text-align: center; color: #7A6040; background: #FAF5EE; border-radius: 12px; }
    .booking-row {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; background: #FFFDF8;
      border: 1px solid rgba(201,168,76,0.12); border-radius: 12px; margin-bottom: 0.7rem;
    }
    .b-date { font-weight: 600; color: #1A1208; font-size: 0.9rem; }
    .b-venue { font-size: 0.82rem; color: #7A6040; }
    .b-guests { font-size: 0.85rem; color: #7A6040; }
    .status-badge {
      margin-right: auto; padding: 0.2rem 0.6rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 600;
    }
    .status-badge.confirmed { background: rgba(45,138,78,0.12); color: #2D8A4E; }
    .status-badge.pending   { background: rgba(201,168,76,0.15); color: #8B6914; }
    .status-badge.cancelled { background: rgba(197,115,122,0.12); color: #C5373A; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client   = signal<Client | null>(null);
  bookings = signal<Booking[]>([]);
  loading  = signal(true);

  constructor(
    private route: ActivatedRoute,
    private clientSvc: ClientService,
    private bookingSvc: BookingService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientSvc.getById(id).subscribe({
      next: c => { this.client.set(c); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.bookingSvc.getAll({ clientId: id }).subscribe({
      next: res => this.bookings.set(res.data),
    });
  }

  statusLabel(s: string) {
    return s === 'Confirmed' ? 'مؤكد' : s === 'Pending' ? 'قيد الانتظار' : 'ملغي';
  }

  budgetLabel(cat: string) {
    const map: any = { Economical: 'اقتصادي', Standard: 'عادي', Premium: 'بريميوم', Luxury: 'فاخر' };
    return map[cat] ?? cat;
  }
}
