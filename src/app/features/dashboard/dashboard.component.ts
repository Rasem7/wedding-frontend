import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-section">
      <div class="dash-header">
        <div>
          <h2>أهلاً! 👋</h2>
          <p>لوحة التحكم — {{ today }}</p>
        </div>
        <button class="btn-primary" routerLink="/booking">+ حجز جديد</button>
      </div>

      @if (loading()) {
        <div class="loading-grid">
          @for (i of [1,2,3,4]; track i) {
            <div class="kpi-skeleton"></div>
          }
        </div>
      } @else if (stats()) {
        <!-- KPIs -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon">💍</div>
            <span class="kpi-value">{{ stats()!.bookingsThisMonth }}</span>
            <div class="kpi-label">حجوزات هذا الشهر</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">💰</div>
            <span class="kpi-value">{{ stats()!.revenueThisMonth | number }}ج</span>
            <div class="kpi-label">إيرادات الشهر</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">👥</div>
            <span class="kpi-value">{{ stats()!.totalClients }}</span>
            <div class="kpi-label">إجمالي العملاء</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">⭐</div>
            <span class="kpi-value">{{ stats()!.averageRating | number:'1.1-1' }}</span>
            <div class="kpi-label">متوسط التقييم</div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="main-grid">
          <!-- Recent Bookings -->
          <div class="dash-card">
            <div class="card-header">
              <h3>آخر الحجوزات</h3>
              <a routerLink="/clients">عرض الكل</a>
            </div>
            @for (b of stats()!.recentBookings; track b.id) {
              <div class="booking-row">
                <div class="booking-avatar">💍</div>
                <div class="booking-info">
                  <div class="booking-name">{{ b.client?.groomName }} & {{ b.client?.brideName }}</div>
                  <div class="booking-date">📅 {{ b.weddingDate | date:'dd/MM/yyyy' }}</div>
                </div>
                <span class="status-badge" [class]="b.status.toLowerCase()">
                  {{ statusLabel(b.status) }}
                </span>
              </div>
            }
          </div>

          <!-- Activity -->
          <div class="dash-card">
            <div class="card-header"><h3>آخر الأنشطة</h3></div>
            @for (a of stats()!.recentActivities; track $index) {
              <div class="activity-row">
                <div class="activity-dot"></div>
                <div>
                  <div class="activity-text">{{ a.text }}</div>
                  <div class="activity-time">{{ a.time }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .dashboard-section { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .dash-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem;
    }
    .dash-header h2 { font-family: 'Amiri', serif; font-size: 1.8rem; color: var(--dark); }
    .dash-header p { color: var(--text-light); font-size: 0.9rem; }
    .btn-primary {
      background: var(--gold); color: white; border: none;
      border-radius: 12px; padding: 0.75rem 1.5rem;
      font-family: 'Tajawal', sans-serif; font-size: 0.95rem;
      font-weight: 600; cursor: pointer;
    }
    .kpi-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.2rem; margin-bottom: 2rem;
    }
    .kpi-card {
      background: var(--white);
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 16px; padding: 1.5rem;
    }
    .kpi-icon { font-size: 1.8rem; margin-bottom: 0.6rem; }
    .kpi-value {
      font-family: 'Amiri', serif; font-size: 2rem;
      font-weight: 700; color: var(--dark); display: block;
    }
    .kpi-label { font-size: 0.8rem; color: var(--text-light); margin-top: 0.2rem; }
    .loading-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; margin-bottom: 2rem;
    }
    .kpi-skeleton {
      height: 120px; border-radius: 16px;
      background: linear-gradient(90deg, #f0e8d8 25%, #faf5ee 50%, #f0e8d8 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer { to { background-position: -200% 0; } }

    .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .dash-card {
      background: var(--white);
      border: 1px solid rgba(201,168,76,0.15);
      border-radius: 18px; padding: 1.5rem;
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 1.2rem;
    }
    .card-header h3 { font-size: 1rem; font-weight: 700; color: var(--dark); }
    .card-header a { font-size: 0.8rem; color: #8B6914; text-decoration: none; cursor: pointer; }

    .booking-row {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.7rem; border-radius: 10px;
      background: var(--cream); margin-bottom: 0.5rem;
    }
    .booking-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #C9A84C; display: flex; align-items: center;
      justify-content: center; font-size: 1.1rem; flex-shrink: 0;
    }
    .booking-info { flex: 1; }
    .booking-name { font-size: 0.88rem; font-weight: 600; color: var(--dark); }
    .booking-date { font-size: 0.78rem; color: var(--text-light); }

    .status-badge {
      padding: 0.2rem 0.6rem; border-radius: 50px;
      font-size: 0.72rem; font-weight: 600;
    }
    .status-badge.confirmed { background: rgba(45,138,78,0.12); color: #2D8A4E; }
    .status-badge.pending   { background: rgba(201,168,76,0.15); color: #8B6914; }
    .status-badge.cancelled { background: rgba(197,115,122,0.12); color: #C5373A; }

    .activity-row {
      display: flex; gap: 0.8rem; padding-bottom: 0.8rem;
      border-bottom: 1px solid rgba(201,168,76,0.08);
      margin-bottom: 0.5rem;
    }
    .activity-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #C9A84C; margin-top: 5px; flex-shrink: 0;
    }
    .activity-text { font-size: 0.84rem; color: var(--text); line-height: 1.5; }
    .activity-time { font-size: 0.74rem; color: var(--text-light); margin-top: 0.2rem; }

    @media (max-width: 768px) { .main-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  private dashSvc = inject(DashboardService);

  stats   = signal<DashboardStats | null>(null);
  loading = signal(true);
  today   = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  ngOnInit() {
    this.dashSvc.getStats().subscribe({
      next: (s: DashboardStats) => { this.stats.set(s); this.loading.set(false); },
      error: () => {
        // Mock data مؤقتة لحد ما الـ Backend يجهز
        this.stats.set({
          totalBookings: 42,
          bookingsThisMonth: 18,
          totalRevenue: 980000,
          revenueThisMonth: 240000,
          totalClients: 124,
          averageRating: 4.8,
          recentBookings: [
            { id:1, clientId:1, client:{ id:1, groomName:'أحمد محمود', brideName:'سارة علي', groomPhone:'', budgetCategory:'Premium', budget:80000, email:'', address:'', createdAt:'' }, weddingDate:'2026-03-15', weddingTime:'', venue:'بالاس ويدينج هول', guestCount:200, eventType:'FullWedding', status:'Confirmed', totalAmount:85000, createdAt:'' },
            { id:2, clientId:2, client:{ id:2, groomName:'خالد إبراهيم', brideName:'منى حسن', groomPhone:'', budgetCategory:'Standard', budget:60000, email:'', address:'', createdAt:'' }, weddingDate:'2026-04-22', weddingTime:'', venue:'قاعة النيل', guestCount:150, eventType:'FullWedding', status:'Pending', totalAmount:60000, createdAt:'' },
          ] as any,
          recentActivities: [
            { text:'تم تأكيد حجز أحمد محمود', time:'منذ ساعتين', type:'booking' },
            { text:'عميل جديد: يوسف ناصر ونور', time:'منذ ٤ ساعات', type:'client' },
            { text:'تم دفع دفعة أولى من خالد', time:'أمس', type:'payment' },
          ] as any,
        });
        this.loading.set(false);
      },
    });
  }

  statusLabel(s: string) {
    return s === 'Confirmed' ? 'مؤكد' : s === 'Pending' ? 'قيد الانتظار' : 'ملغي';
  }
}
