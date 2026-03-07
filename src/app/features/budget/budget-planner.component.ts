import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Service {
  id: string;
  icon: string;
  name: string;
  selected: boolean;
  minPct: number;   // الحد الأدنى من الميزانية
  maxPct: number;   // الحد الأقصى من الميزانية
  suggestions: Suggestion[];
}

interface Suggestion {
  name: string;
  price: number;
  rating: number;
  location: string;
  badge?: string;
}

interface BudgetResult {
  service: Service;
  allocated: number;
  suggestion: Suggestion;
}

const SERVICES_DATA: Service[] = [
  {
    id: 'hall', icon: '🏛️', name: 'قاعة الأفراح', selected: false,
    minPct: 30, maxPct: 45,
    suggestions: [
      { name: 'بالاس ويدينج هول', price: 35000, rating: 4.9, location: 'مدينة نصر', badge: 'الأفضل' },
      { name: 'قاعة النيل الكبرى', price: 22000, rating: 4.6, location: 'المعادي' },
      { name: 'فيلا الأميرة', price: 55000, rating: 4.8, location: 'التجمع الخامس', badge: 'فاخرة' },
      { name: 'قاعة الفرحة', price: 12000, rating: 4.3, location: 'شبرا' },
      { name: 'كونتيننتال هوتيل', price: 80000, rating: 5.0, location: 'وسط البلد', badge: 'لوكشري' },
    ]
  },
  {
    id: 'photo', icon: '📸', name: 'تصوير وفيديو', selected: false,
    minPct: 10, maxPct: 18,
    suggestions: [
      { name: 'ستوديو ليلى فوتو', price: 8000, rating: 4.8, location: 'المعادي', badge: 'الأفضل' },
      { name: 'فيجن ستوديو', price: 5000, rating: 4.5, location: 'مصر الجديدة' },
      { name: 'برو شوت', price: 15000, rating: 4.9, location: 'الزمالك', badge: 'مميز' },
      { name: 'كابتشر مومنتس', price: 3500, rating: 4.2, location: 'عين شمس' },
    ]
  },
  {
    id: 'flowers', icon: '🌸', name: 'زهور وزينة', selected: false,
    minPct: 8, maxPct: 15,
    suggestions: [
      { name: 'فلاورز باي نور', price: 6000, rating: 4.7, location: 'الزمالك', badge: 'الأفضل' },
      { name: 'جاردن تاتش', price: 3500, rating: 4.4, location: 'المهندسين' },
      { name: 'رويال فلاورز', price: 12000, rating: 4.8, location: 'التجمع', badge: 'فاخرة' },
      { name: 'بلوم ديكور', price: 2000, rating: 4.1, location: 'حلوان' },
    ]
  },
  {
    id: 'dress', icon: '👗', name: 'فستان العروسة', selected: false,
    minPct: 8, maxPct: 15,
    suggestions: [
      { name: 'جلوري برايدال', price: 8000, rating: 4.9, location: 'المهندسين', badge: 'الأكثر طلباً' },
      { name: 'لا مارييه', price: 5000, rating: 4.6, location: 'مصر الجديدة' },
      { name: 'إيليت برايد', price: 18000, rating: 4.8, location: 'الزمالك', badge: 'فاخر' },
      { name: 'وايت دريم', price: 3000, rating: 4.3, location: 'شبرا' },
    ]
  },
  {
    id: 'beauty', icon: '💄', name: 'كوافير ومكياج', selected: false,
    minPct: 5, maxPct: 10,
    suggestions: [
      { name: 'جلام بيوتي', price: 4000, rating: 4.8, location: 'المعادي', badge: 'الأفضل' },
      { name: 'رويال تاتش', price: 2500, rating: 4.5, location: 'مدينة نصر' },
      { name: 'لوكس مكياج', price: 7000, rating: 4.9, location: 'الزمالك', badge: 'فاخر' },
      { name: 'بيوتي كورنر', price: 1500, rating: 4.2, location: 'عين شمس' },
    ]
  },
  {
    id: 'catering', icon: '🍽️', name: 'كيترينج (أكل)', selected: false,
    minPct: 20, maxPct: 35,
    suggestions: [
      { name: 'لافوشيه كيترينج', price: 150, rating: 4.6, location: 'التجمع', badge: 'الأفضل' },
      { name: 'ماجستيك فود', price: 90, rating: 4.4, location: 'مدينة نصر' },
      { name: 'جراند كيترينج', price: 250, rating: 4.8, location: 'الزمالك', badge: 'فاخر' },
      { name: 'إيجيبت كيترينج', price: 60, rating: 4.1, location: 'شبرا' },
    ]
  },
  {
    id: 'car', icon: '🚗', name: 'سيارة الزفاف', selected: false,
    minPct: 3, maxPct: 6,
    suggestions: [
      { name: 'رويال كارز', price: 3000, rating: 4.7, location: 'القاهرة', badge: 'الأفضل' },
      { name: 'كلاسيك ريد', price: 1800, rating: 4.4, location: 'المعادي' },
      { name: 'لوكس ليمو', price: 5000, rating: 4.9, location: 'التجمع', badge: 'فاخر' },
      { name: 'برايد رايد', price: 1200, rating: 4.2, location: 'عين شمس' },
    ]
  },
];

@Component({
  selector: 'app-budget-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Trigger Button -->
    <button class="budget-trigger" (click)="open()">
      <span>🧮</span>
      <span>احسب ميزانيتك بالـ AI</span>
      <span class="trigger-badge">جديد ✨</span>
    </button>

    <!-- Modal Overlay -->
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-box">

          <!-- Header -->
          <div class="modal-head">
            <div class="modal-title-wrap">
              <span class="modal-emoji">🧮</span>
              <div>
                <h2 class="modal-title">احسب ميزانية فرحك</h2>
                <p class="modal-sub">الـ AI هيوزع ميزانيتك على الخدمات المناسبة</p>
              </div>
            </div>
            <button class="close-btn" (click)="close()">✕</button>
          </div>

          <!-- Step 1: Budget + Services -->
          @if (step() === 1) {
            <div class="modal-body" @fadeIn>

              <!-- Budget Input -->
              <div class="budget-input-section">
                <label class="field-label">إجمالي الميزانية (جنيه مصري)</label>
                <div class="budget-input-wrap">
                  <input
                    type="number"
                    class="budget-input"
                    [(ngModel)]="budget"
                    placeholder="مثال: 80000"
                    min="10000"
                    step="5000"
                  >
                  <span class="currency">ج.م</span>
                </div>
                <!-- Quick budget buttons -->
                <div class="quick-budgets">
                  @for (b of quickBudgets; track b.val) {
                    <button
                      class="quick-btn"
                      [class.active]="budget === b.val"
                      (click)="budget = b.val"
                    >{{ b.label }}</button>
                  }
                </div>
              </div>

              <!-- Budget Category -->
              @if (budget > 0) {
                <div class="budget-cat-pill" [class]="getBudgetCat().cls">
                  {{ getBudgetCat().icon }} {{ getBudgetCat().label }}
                </div>
              }

              <!-- Guests Count -->
              <div class="field-group">
                <label class="field-label">عدد المدعوين</label>
                <input type="number" class="field-input" [(ngModel)]="guests" placeholder="مثال: 300" min="50">
              </div>

              <!-- Services Selection -->
              <div class="services-section">
                <label class="field-label">اختار الترتيبات اللي محتاجها</label>
                <p class="field-hint">كل ما اخترت أكتر، الـ AI هيوزع أدق</p>
                <div class="services-grid">
                  @for (svc of services(); track svc.id) {
                    <div
                      class="svc-chip"
                      [class.selected]="svc.selected"
                      (click)="toggleService(svc)"
                    >
                      <span class="svc-chip-icon">{{ svc.icon }}</span>
                      <span class="svc-chip-name">{{ svc.name }}</span>
                      @if (svc.selected) {
                        <span class="svc-chip-check">✓</span>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Selected count -->
              @if (selectedCount() > 0) {
                <p class="selected-hint">✅ اخترت {{ selectedCount() }} ترتيبات</p>
              }

              <button
                class="btn-calculate"
                [disabled]="!canCalculate()"
                (click)="calculate()"
              >
                @if (loading()) {
                  <span class="spinner"></span> جاري التحليل...
                } @else {
                  🤖 احسب واقترح بالـ AI
                }
              </button>
            </div>
          }

          <!-- Step 2: Results -->
          @if (step() === 2) {
            <div class="modal-body">

              <!-- Summary Bar -->
              <div class="result-summary">
                <div class="summary-item">
                  <span class="sum-label">الميزانية الكلية</span>
                  <span class="sum-val gold">{{ formatNum(budget) }} ج</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-item">
                  <span class="sum-label">الخدمات المختارة</span>
                  <span class="sum-val">{{ selectedCount() }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-item">
                  <span class="sum-label">التكلفة المتوقعة</span>
                  <span class="sum-val" [class.over]="totalCost() > budget" [class.ok]="totalCost() <= budget">
                    {{ formatNum(totalCost()) }} ج
                  </span>
                </div>
              </div>

              <!-- Budget Bar -->
              <div class="budget-bar-wrap">
                <div class="budget-bar-track">
                  <div
                    class="budget-bar-fill"
                    [style.width.%]="Math.min((totalCost()/budget)*100, 100)"
                    [class.over]="totalCost() > budget"
                  ></div>
                </div>
                <div class="budget-bar-labels">
                  <span>٠</span>
                  <span [class.over]="totalCost() > budget">
                    {{ totalCost() > budget ? '⚠️ تجاوزت الميزانية' : '✅ في حدود الميزانية' }}
                  </span>
                  <span>{{ formatNum(budget) }}</span>
                </div>
              </div>

              <!-- Results Cards -->
              <div class="results-list">
                @for (r of results(); track r.service.id) {
                  <div class="result-card">
                    <div class="result-card-head">
                      <div class="result-svc-info">
                        <span class="result-icon">{{ r.service.icon }}</span>
                        <div>
                          <div class="result-svc-name">{{ r.service.name }}</div>
                          <div class="result-allocated">
                            ميزانية مقترحة: <strong>{{ formatNum(r.allocated) }} ج</strong>
                          </div>
                        </div>
                      </div>
                      <div class="result-pct">
                        {{ getPct(r.allocated) }}٪
                      </div>
                    </div>

                    <!-- Best Match -->
                    <div class="best-match">
                      <div class="match-header">
                        <span class="match-badge">⭐ الأنسب لميزانيتك</span>
                        @if (r.suggestion.badge) {
                          <span class="vendor-badge">{{ r.suggestion.badge }}</span>
                        }
                      </div>
                      <div class="match-body">
                        <div class="match-info">
                          <div class="match-name">{{ r.suggestion.name }}</div>
                          <div class="match-meta">
                            📍 {{ r.suggestion.location }} &nbsp;·&nbsp;
                            ⭐ {{ r.suggestion.rating }}
                          </div>
                        </div>
                        <div class="match-price">
                          {{ r.service.id === 'catering'
                            ? formatNum(r.suggestion.price) + ' ج/ش'
                            : formatNum(r.suggestion.price) + ' ج' }}
                        </div>
                      </div>
                    </div>

                    <!-- Alternatives toggle -->
                    <button class="alts-toggle" (click)="toggleAlts(r.service.id)">
                      {{ showAlts()[r.service.id] ? '▲ إخفاء البدائل' : '▼ عرض بدائل أخرى' }}
                    </button>

                    @if (showAlts()[r.service.id]) {
                      <div class="alts-list">
                        @for (alt of getAlts(r.service); track alt.name) {
                          <div class="alt-item">
                            <div>
                              <div class="alt-name">{{ alt.name }}</div>
                              <div class="alt-meta">📍 {{ alt.location }} · ⭐ {{ alt.rating }}</div>
                            </div>
                            <div class="alt-price">
                              {{ r.service.id === 'catering'
                                ? formatNum(alt.price) + ' ج/ش'
                                : formatNum(alt.price) + ' ج' }}
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- AI Tip -->
              <div class="ai-tip">
                <span class="ai-tip-icon">💡</span>
                <div>
                  <strong>نصيحة الـ AI:</strong>
                  {{ aiTip() }}
                </div>
              </div>

              <!-- Actions -->
              <div class="result-actions">
                <button class="btn-back" (click)="step.set(1)">← تعديل</button>
                <button class="btn-book-all" (click)="bookAll()">احجز دلوقتي 🎊</button>
              </div>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    /* ── Trigger ── */
    .budget-trigger {
      display: inline-flex; align-items: center; gap: .6rem;
      background: linear-gradient(135deg, #1A1208, #2D2010);
      color: #E8C87A; border: none; border-radius: 14px;
      padding: .85rem 1.6rem; font-family: 'Tajawal', sans-serif;
      font-size: .95rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 20px rgba(26,18,8,0.25); transition: all .25s;
    }
    .budget-trigger:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,18,8,0.3); }
    .trigger-badge {
      background: #C9A84C; color: #fff; padding: .12rem .5rem;
      border-radius: 50px; font-size: .7rem; font-weight: 700;
    }

    /* ── Overlay ── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 3000;
      background: rgba(26,18,8,0.6); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .modal-box {
      background: #FFFDF8; border-radius: 24px; width: 100%;
      max-width: 600px; max-height: 90vh; overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      animation: slideUp .35s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes slideUp { from { opacity:0; transform: translateY(30px) scale(.97); } }

    /* ── Header ── */
    .modal-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid rgba(201,168,76,0.15);
      flex-shrink: 0;
    }
    .modal-title-wrap { display: flex; gap: .9rem; align-items: center; }
    .modal-emoji { font-size: 2rem; }
    .modal-title { font-family: 'Amiri', serif; font-size: 1.35rem; color: #1A1208; }
    .modal-sub { font-size: .8rem; color: #7A6040; margin-top: .1rem; }
    .close-btn {
      width: 32px; height: 32px; border-radius: 8px; border: none;
      background: #FAF5EE; color: #7A6040; cursor: pointer; font-size: .95rem;
      flex-shrink: 0;
    }
    .close-btn:hover { background: rgba(197,115,122,.12); color: #C5737A; }

    /* ── Body ── */
    .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }

    /* ── Budget Input ── */
    .budget-input-section { margin-bottom: 1rem; }
    .field-label { display: block; font-size: .82rem; font-weight: 700; color: #3D2B10; margin-bottom: .4rem; }
    .field-hint { font-size: .75rem; color: #7A6040; margin-bottom: .6rem; margin-top: -.2rem; }
    .budget-input-wrap { position: relative; }
    .budget-input {
      width: 100%; padding: .85rem 3.5rem .85rem 1rem;
      border: 2px solid rgba(201,168,76,0.25); border-radius: 12px;
      background: #FAF5EE; font-family: 'Tajawal', sans-serif;
      font-size: 1.2rem; font-weight: 700; color: #1A1208; outline: none;
    }
    .budget-input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 3px rgba(201,168,76,.12); }
    .currency {
      position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
      font-size: .82rem; color: #7A6040; font-weight: 600;
    }
    .quick-budgets { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .7rem; }
    .quick-btn {
      padding: .3rem .8rem; border-radius: 50px;
      border: 1.5px solid rgba(201,168,76,.3);
      background: transparent; color: #7A6040;
      font-family: 'Tajawal', sans-serif; font-size: .78rem; cursor: pointer; transition: all .2s;
    }
    .quick-btn.active, .quick-btn:hover { background: #C9A84C; color: #fff; border-color: #C9A84C; }

    /* ── Budget Category ── */
    .budget-cat-pill {
      display: inline-block; padding: .35rem 1rem; border-radius: 50px;
      font-size: .78rem; font-weight: 700; margin-bottom: 1rem;
    }
    .budget-cat-pill.eco { background: rgba(45,122,78,.1); color: #2D7A4E; }
    .budget-cat-pill.std { background: rgba(201,168,76,.12); color: #8B6914; }
    .budget-cat-pill.pre { background: rgba(26,86,196,.1); color: #1A56C4; }
    .budget-cat-pill.lux { background: rgba(197,115,122,.1); color: #C5373A; }

    .field-group { margin-bottom: 1.2rem; }
    .field-input {
      width: 100%; padding: .72rem 1rem;
      border: 1.5px solid rgba(201,168,76,.2); border-radius: 10px;
      background: #FAF5EE; font-family: 'Tajawal', sans-serif;
      font-size: .9rem; color: #1A1208; outline: none;
    }
    .field-input:focus { border-color: #C9A84C; background: #fff; }

    /* ── Services Grid ── */
    .services-section { margin-bottom: 1.2rem; }
    .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-top: .5rem; }
    .svc-chip {
      display: flex; align-items: center; gap: .6rem;
      padding: .7rem .9rem; border-radius: 10px;
      background: #FAF5EE; border: 1.5px solid transparent;
      cursor: pointer; transition: all .2s; position: relative;
    }
    .svc-chip:hover { border-color: rgba(201,168,76,.35); background: rgba(201,168,76,.05); }
    .svc-chip.selected { border-color: #C9A84C; background: rgba(201,168,76,.08); }
    .svc-chip-icon { font-size: 1.2rem; }
    .svc-chip-name { font-size: .83rem; font-weight: 500; color: #3D2B10; flex: 1; }
    .svc-chip-check {
      width: 20px; height: 20px; border-radius: 50%;
      background: #C9A84C; color: #fff; font-size: .7rem;
      display: flex; align-items: center; justify-content: center; font-weight: 700;
    }
    .selected-hint { font-size: .8rem; color: #2D7A4E; margin-bottom: 1rem; font-weight: 600; }

    /* ── Calculate Button ── */
    .btn-calculate {
      width: 100%; padding: 1rem; background: #C9A84C; color: #fff;
      border: none; border-radius: 12px; font-family: 'Tajawal', sans-serif;
      font-size: 1rem; font-weight: 700; cursor: pointer; transition: all .2s;
      display: flex; align-items: center; justify-content: center; gap: .5rem;
    }
    .btn-calculate:hover:not(:disabled) { background: #1A1208; }
    .btn-calculate:disabled { opacity: .5; cursor: not-allowed; }
    .spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin .7s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Results ── */
    .result-summary {
      display: flex; gap: 1rem; background: #FAF5EE; border-radius: 12px;
      padding: 1rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .summary-item { flex: 1; text-align: center; }
    .sum-label { display: block; font-size: .72rem; color: #7A6040; margin-bottom: .2rem; }
    .sum-val { font-family: 'Amiri', serif; font-size: 1.2rem; font-weight: 700; color: #1A1208; }
    .sum-val.gold { color: #8B6914; }
    .sum-val.over { color: #C5373A; }
    .sum-val.ok { color: #2D7A4E; }
    .summary-divider { width: 1px; background: rgba(201,168,76,.2); }

    /* ── Budget Bar ── */
    .budget-bar-wrap { margin-bottom: 1.5rem; }
    .budget-bar-track {
      height: 10px; background: rgba(201,168,76,.15);
      border-radius: 50px; overflow: hidden; margin-bottom: .4rem;
    }
    .budget-bar-fill {
      height: 100%; background: linear-gradient(90deg, #2D7A4E, #C9A84C);
      border-radius: 50px; transition: width .8s ease;
    }
    .budget-bar-fill.over { background: linear-gradient(90deg, #C9A84C, #C5373A); }
    .budget-bar-labels {
      display: flex; justify-content: space-between;
      font-size: .7rem; color: #7A6040;
    }
    .budget-bar-labels .over { color: #C5373A; font-weight: 700; }

    /* ── Result Cards ── */
    .results-list { display: flex; flex-direction: column; gap: .8rem; margin-bottom: 1rem; }
    .result-card {
      background: #fff; border: 1px solid rgba(201,168,76,.15);
      border-radius: 14px; padding: 1rem; overflow: hidden;
    }
    .result-card-head {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: .8rem;
    }
    .result-svc-info { display: flex; gap: .7rem; align-items: center; }
    .result-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(201,168,76,.1); display: flex;
      align-items: center; justify-content: center; font-size: 1.2rem;
    }
    .result-svc-name { font-weight: 700; font-size: .9rem; color: #1A1208; }
    .result-allocated { font-size: .75rem; color: #7A6040; margin-top: .1rem; }
    .result-allocated strong { color: #8B6914; }
    .result-pct {
      background: rgba(201,168,76,.1); color: #8B6914;
      padding: .25rem .6rem; border-radius: 50px;
      font-size: .75rem; font-weight: 700;
    }

    /* ── Best Match ── */
    .best-match {
      background: rgba(201,168,76,.05); border: 1px solid rgba(201,168,76,.18);
      border-radius: 10px; padding: .8rem; margin-bottom: .6rem;
    }
    .match-header { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
    .match-badge { font-size: .72rem; font-weight: 700; color: #8B6914; }
    .vendor-badge {
      background: #1A1208; color: #E8C87A;
      padding: .12rem .5rem; border-radius: 50px; font-size: .65rem; font-weight: 700;
    }
    .match-body { display: flex; justify-content: space-between; align-items: center; }
    .match-name { font-weight: 700; font-size: .88rem; color: #1A1208; }
    .match-meta { font-size: .75rem; color: #7A6040; margin-top: .15rem; }
    .match-price { font-weight: 700; color: #8B6914; font-size: .95rem; white-space: nowrap; }

    /* ── Alternatives ── */
    .alts-toggle {
      background: none; border: none; color: #7A6040; font-family: 'Tajawal', sans-serif;
      font-size: .75rem; cursor: pointer; padding: 0; margin-top: .2rem;
    }
    .alts-toggle:hover { color: #C9A84C; }
    .alts-list { margin-top: .6rem; display: flex; flex-direction: column; gap: .4rem; }
    .alt-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: .5rem .7rem; background: #FAF5EE; border-radius: 8px;
    }
    .alt-name { font-size: .82rem; color: #1A1208; font-weight: 500; }
    .alt-meta { font-size: .72rem; color: #7A6040; }
    .alt-price { font-size: .82rem; font-weight: 700; color: #7A6040; white-space: nowrap; }

    /* ── AI Tip ── */
    .ai-tip {
      display: flex; gap: .8rem; background: rgba(26,86,196,.06);
      border: 1px solid rgba(26,86,196,.15); border-radius: 12px;
      padding: 1rem; margin-bottom: 1.2rem; font-size: .83rem; color: #1A1208;
      line-height: 1.6;
    }
    .ai-tip-icon { font-size: 1.3rem; flex-shrink: 0; }

    /* ── Actions ── */
    .result-actions { display: flex; gap: .8rem; }
    .btn-back {
      flex: 1; padding: .85rem; background: transparent;
      border: 1.5px solid rgba(201,168,76,.3); border-radius: 12px;
      font-family: 'Tajawal', sans-serif; font-size: .9rem; color: #7A6040; cursor: pointer;
    }
    .btn-back:hover { border-color: #C9A84C; color: #8B6914; }
    .btn-book-all {
      flex: 2; padding: .85rem; background: #C9A84C; color: #fff;
      border: none; border-radius: 12px; font-family: 'Tajawal', sans-serif;
      font-size: .95rem; font-weight: 700; cursor: pointer;
    }
    .btn-book-all:hover { background: #1A1208; }

    @media (max-width: 500px) {
      .services-grid { grid-template-columns: 1fr; }
      .result-summary { flex-direction: column; }
    }
  `]
})
export class BudgetPlannerComponent {
  @Output() bookingRequested = new EventEmitter<BudgetResult[]>();

  isOpen = signal(false);
  step = signal(1);
  loading = signal(false);
  budget = 0;
  guests = 300;
  services = signal<Service[]>(SERVICES_DATA.map(s => ({ ...s, selected: false })));
  results = signal<BudgetResult[]>([]);
  showAlts = signal<Record<string, boolean>>({});

  protected Math = Math;

  quickBudgets = [
    { label: '٣٠,٠٠٠', val: 30000 },
    { label: '٥٠,٠٠٠', val: 50000 },
    { label: '٨٠,٠٠٠', val: 80000 },
    { label: '١٢٠,٠٠٠', val: 120000 },
    { label: '٢٠٠,٠٠٠', val: 200000 },
  ];

  open() { this.isOpen.set(true); document.body.style.overflow = 'hidden'; }
  close() { this.isOpen.set(false); document.body.style.overflow = ''; }
  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.close();
  }

  toggleService(svc: Service) {
    this.services.update(list =>
      list.map(s => s.id === svc.id ? { ...s, selected: !s.selected } : s)
    );
  }

  selectedCount() { return this.services().filter(s => s.selected).length; }
  canCalculate() { return this.budget >= 10000 && this.selectedCount() > 0; }

  getBudgetCat() {
    if (this.budget < 30000) return { label: 'اقتصادية', icon: '💚', cls: 'eco' };
    if (this.budget < 70000) return { label: 'متوسطة', icon: '💛', cls: 'std' };
    if (this.budget < 150000) return { label: 'بريميوم', icon: '💙', cls: 'pre' };
    return { label: 'لوكشري ✨', icon: '💜', cls: 'lux' };
  }

  calculate() {
    this.loading.set(true);
    setTimeout(() => {
      const selected = this.services().filter(s => s.selected);
      const totalPct = selected.reduce((sum, s) => sum + (s.minPct + s.maxPct) / 2, 0);

      const results: BudgetResult[] = selected.map(svc => {
        const pct = (svc.minPct + svc.maxPct) / 2;
        const allocated = Math.round((this.budget * pct / totalPct) / 500) * 500;

        // Find best matching suggestion based on budget
        const best = svc.suggestions
          .filter(s => {
            const price = svc.id === 'catering' ? s.price * this.guests : s.price;
            return price <= allocated * 1.1;
          })
          .sort((a, b) => b.rating - a.rating)[0]
          || svc.suggestions.sort((a, b) => a.price - b.price)[0];

        return { service: svc, allocated, suggestion: best };
      });

      this.results.set(results);
      this.loading.set(false);
      this.step.set(2);
    }, 1800);
  }

  totalCost() {
    return this.results().reduce((sum, r) => {
      const price = r.service.id === 'catering'
        ? r.suggestion.price * this.guests
        : r.suggestion.price;
      return sum + price;
    }, 0);
  }

  getPct(allocated: number) {
    return Math.round((allocated / this.budget) * 100);
  }

  getAlts(svc: Service) {
    return svc.suggestions.slice(1);
  }

  toggleAlts(id: string) {
    this.showAlts.update(v => ({ ...v, [id]: !v[id] }));
  }

  aiTip() {
    const cat = this.getBudgetCat().cls;
    const tips: Record<string, string> = {
      eco: 'ميزانيتك محدودة — ركز على القاعة والكيترينج وقلل في الكماليات. كتير ناس بتعمل فرح حلو جداً بميزانية محدودة!',
      std: 'ميزانية كويسة! ممكن توفر في بند وتصرفه في بند تاني أهم ليك. الزهور مثلاً ممكن تتعمل بأقل.',
      pre: 'ميزانية ممتازة! عندك مرونة تختار خدمات عالية الجودة. اهتم بالتصوير والقاعة — دول اللي يفضل معاك للأبد.',
      lux: 'ميزانية لوكشري! قدر تاخد أحسن حاجة في كل بند. استثمر في تجربة ضيوفك — الكيترينج والموسيقى بيفرقوا جداً.'
    };
    return tips[cat] || tips['std'];
  }

  formatNum(n: number) {
    return n >= 1000 ? (n / 1000).toFixed(0) + ',000' : n.toString();
  }

  bookAll() {
    this.close();
    this.bookingRequested.emit(this.results());
  }
}
