import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const MOCK_EVENTS = [
  { day: 15, month: 2, year: 2026, name: 'فرح أحمد وسارة', venue: 'بالاس ويدينج هول' },
  { day: 22, month: 2, year: 2026, name: 'فرح خالد ومنى', venue: 'قاعة النيل' },
  { day: 5,  month: 3, year: 2026, name: 'فرح عمر وريهام', venue: 'فيلا الأميرة' },
  { day: 18, month: 3, year: 2026, name: 'فرح يوسف ونور', venue: 'كونتيننتال هوتيل' },
];

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const DAYS_AR   = ['ح','ن','ث','ر','خ','ج','س'];

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="calendar-section">
      <div class="section-header">
        <div class="section-tag">التقويم</div>
        <h2 class="section-title">جدول <em>الحفلات</em></h2>
      </div>

      <div class="cal-card">
        <!-- Nav -->
        <div class="cal-nav">
          <button class="nav-btn" (click)="changeMonth(-1)">›</button>
          <div class="month-label">{{ monthLabel() }}</div>
          <button class="nav-btn" (click)="changeMonth(1)">‹</button>
        </div>

        <!-- Days header -->
        <div class="cal-grid">
          @for (d of daysAr; track d) {
            <div class="cal-day-header">{{ d }}</div>
          }
          <!-- Empty cells -->
          @for (e of emptyStart(); track $index) {
            <div></div>
          }
          <!-- Days -->
          @for (d of daysInMonth(); track d) {
            <div class="cal-day"
                 [class.today]="isToday(d)"
                 [class.has-event]="hasEvent(d)"
                 (click)="selectDay(d)">
              {{ d }}
            </div>
          }
        </div>
      </div>

      <!-- Events List -->
      <div class="events-list">
        <h3>الحفلات القادمة</h3>
        @for (e of upcomingEvents(); track e.name) {
          <div class="event-item">
            <div class="event-date">
              <div class="event-day">{{ e.day }}</div>
              <div class="event-month">{{ MONTHS_AR[e.month] }}</div>
            </div>
            <div class="event-info">
              <h4>{{ e.name }}</h4>
              <p>📍 {{ e.venue }}</p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .calendar-section { padding: 2rem; max-width: 900px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 2rem; }
    .section-tag {
      display: inline-block; background: rgba(201,168,76,0.12);
      border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
      padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;
    }
    .section-title { font-family: 'Amiri', serif; font-size: 2rem; color: #1A1208; }
    .section-title em { color: #C9A84C; font-style: italic; }

    .cal-card {
      background: #FFFDF8; border-radius: 20px; padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(26,18,8,0.08);
      border: 1px solid rgba(201,168,76,0.15); margin-bottom: 2rem;
    }
    .cal-nav { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1.5rem; }
    .nav-btn {
      width: 36px; height: 36px; border-radius: 8px;
      border: 1.5px solid rgba(201,168,76,0.3); background: none;
      cursor: pointer; font-size: 1.1rem; color: #8B6914; transition: all 0.2s;
    }
    .nav-btn:hover { background: #C9A84C; color: white; border-color: #C9A84C; }
    .month-label { font-family: 'Amiri', serif; font-size: 1.3rem; color: #1A1208; font-weight: 700; min-width: 180px; text-align: center; }

    .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.3rem; }
    .cal-day-header {
      text-align: center; font-size: 0.72rem; font-weight: 700;
      color: #7A6040; padding: 0.5rem; text-transform: uppercase;
    }
    .cal-day {
      aspect-ratio: 1; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; cursor: pointer; transition: all 0.15s;
      position: relative; background: #FAF5EE; border: 1px solid transparent;
    }
    .cal-day:hover { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.3); }
    .cal-day.today { background: #C9A84C; color: white; font-weight: 700; }
    .cal-day.has-event::after {
      content: ''; width: 5px; height: 5px; border-radius: 50%;
      background: #C5737A; position: absolute; bottom: 4px;
    }

    .events-list h3 { font-family: 'Amiri', serif; font-size: 1.2rem; color: #1A1208; margin-bottom: 1rem; }
    .event-item {
      display: flex; gap: 1rem; align-items: flex-start;
      padding: 0.8rem; background: #FFFDF8; border-radius: 10px;
      margin-bottom: 0.5rem; border-right: 3px solid #C9A84C;
      border: 1px solid rgba(201,168,76,0.12); border-right: 3px solid #C9A84C;
    }
    .event-date { text-align: center; min-width: 40px; }
    .event-day { font-family: 'Amiri', serif; font-size: 1.5rem; font-weight: 700; color: #8B6914; line-height: 1; }
    .event-month { font-size: 0.68rem; color: #7A6040; text-transform: uppercase; }
    .event-info h4 { font-size: 0.9rem; font-weight: 600; color: #1A1208; margin-bottom: 0.2rem; }
    .event-info p { font-size: 0.8rem; color: #7A6040; }
  `]
})
export class CalendarComponent {
  daysAr = DAYS_AR;
  MONTHS_AR = MONTHS_AR;

  private today = new Date();
  currentYear  = signal(this.today.getFullYear());
  currentMonth = signal(this.today.getMonth()); // 0-based

  monthLabel = computed(() => `${MONTHS_AR[this.currentMonth()]} ${this.currentYear()}`);

  daysInMonth = computed(() => {
    const count = new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  emptyStart = computed(() => {
    const first = new Date(this.currentYear(), this.currentMonth(), 1).getDay();
    return Array.from({ length: first });
  });

  upcomingEvents = computed(() =>
    MOCK_EVENTS.filter(e => e.year === this.currentYear() && e.month === this.currentMonth())
  );

  changeMonth(dir: number) {
    let m = this.currentMonth() + dir;
    let y = this.currentYear();
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    this.currentMonth.set(m);
    this.currentYear.set(y);
  }

  isToday(d: number) {
    return d === this.today.getDate()
      && this.currentMonth() === this.today.getMonth()
      && this.currentYear() === this.today.getFullYear();
  }

  hasEvent(d: number) {
    return MOCK_EVENTS.some(e => e.day === d && e.month === this.currentMonth() && e.year === this.currentYear());
  }

  selectDay(d: number) {
    const ev = MOCK_EVENTS.find(e => e.day === d && e.month === this.currentMonth() && e.year === this.currentYear());
    if (ev) alert(`${ev.name}\n📍 ${ev.venue}`);
  }
}
