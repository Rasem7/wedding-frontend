import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../../core/services/api.service';
import { Vendor } from '../../../core/models';

const CATEGORIES = ['الكل', 'قاعات الأفراح', 'التصوير والفيديو', 'تنسيق الزهور', 'الكيترينج', 'كوافير ومكياج', 'فساتين الزفاف', 'الموسيقى'];

@Component({
  selector: 'app-vendors-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة مزودو الخدمة</h1>
          <p class="page-sub">{{ filtered().length }} مزود خدمة</p>
        </div>
        <button class="btn-add" (click)="openModal()">
          <span>+</span> إضافة مزود خدمة
        </button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input class="search-input" [(ngModel)]="searchQ" (ngModelChange)="applyFilters()"
                 placeholder="ابحث بالاسم أو الموقع...">
        </div>

        <select class="filter-select" [(ngModel)]="filterCategory" (ngModelChange)="applyFilters()">
          @for (c of categories; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>

        <select class="filter-select" [(ngModel)]="filterRating" (ngModelChange)="applyFilters()">
          <option value="">كل التقييمات</option>
          <option value="4.5">4.5+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="3">3+ ⭐</option>
        </select>

        <select class="filter-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
          <option value="rating">ترتيب بالتقييم</option>
          <option value="price_asc">السعر: الأقل</option>
          <option value="price_desc">السعر: الأعلى</option>
          <option value="reviews">عدد التقييمات</option>
          <option value="name">الاسم</option>
        </select>
      </div>

      <!-- Table -->
      @if (loading()) {
        <div class="loading">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton-row"></div>
          }
        </div>
      } @else {
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>الفئة</th>
                <th>الموقع</th>
                <th>التقييم</th>
                <th>السعر من</th>
                <th>التقييمات</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (v of filtered(); track v.id) {
                <tr class="table-row">
                  <td class="td-id">{{ v.id }}</td>
                  <td class="td-name">
                    <div class="name-cell">
                      <div class="name-avatar">{{ v.name[0] }}</div>
                      <div>
                        <div class="name-text">{{ v.name }}</div>
                        <div class="phone-text">{{ v.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="cat-badge">{{ v.category }}</span></td>
                  <td class="td-loc">📍 {{ v.location }}</td>
                  <td>
                    <div class="rating-cell">
                      <span class="stars">★</span>
                      <strong>{{ v.rating }}</strong>
                    </div>
                  </td>
                  <td class="td-price">{{ v.priceFrom | number }} ج</td>
                  <td class="td-reviews">{{ v.reviewCount }}</td>
                  <td>
                    <span class="status-badge" [class.active]="v.isActive" [class.inactive]="!v.isActive">
                      {{ v.isActive ? 'نشط' : 'غير نشط' }}
                    </span>
                  </td>
                  <td>
                    <div class="actions-cell">
                      <button class="btn-edit" (click)="openModal(v)" title="تعديل">✏️</button>
                      <button class="btn-delete" (click)="confirmDelete(v)" title="حذف">🗑️</button>
                    </div>
                  </td>
                </tr>
              }
              @if (filtered().length === 0) {
                <tr>
                  <td colspan="9" class="empty-td">
                    <div class="empty">
                      <div>🏪</div>
                      <p>لا يوجد نتائج</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editMode ? 'تعديل مزود الخدمة' : 'إضافة مزود خدمة جديد' }}</h2>
              <button class="modal-close" (click)="closeModal()">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>الاسم *</label>
                  <input [(ngModel)]="form.name" placeholder="اسم مزود الخدمة">
                </div>
                <div class="form-group">
                  <label>الفئة *</label>
                  <select [(ngModel)]="form.category">
                    @for (c of categories.slice(1); track c) {
                      <option [value]="c">{{ c }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>الموقع *</label>
                  <input [(ngModel)]="form.location" placeholder="المنطقة، المدينة">
                </div>
                <div class="form-group">
                  <label>رقم الهاتف</label>
                  <input [(ngModel)]="form.phone" placeholder="01xxxxxxxxx">
                </div>
                <div class="form-group">
                  <label>السعر يبدأ من (جنيه)</label>
                  <input type="number" [(ngModel)]="form.priceFrom" placeholder="0">
                </div>
                <div class="form-group">
                  <label>التقييم (1-5)</label>
                  <input type="number" [(ngModel)]="form.rating" min="1" max="5" step="0.1" placeholder="4.5">
                </div>
                <div class="form-group">
                  <label>عدد التقييمات</label>
                  <input type="number" [(ngModel)]="form.reviewCount" placeholder="0">
                </div>
                <div class="form-group">
                  <label>الحالة</label>
                  <select [(ngModel)]="form.isActive">
                    <option [ngValue]="true">نشط</option>
                    <option [ngValue]="false">غير نشط</option>
                  </select>
                </div>
                <div class="form-group full-width">
                  <label>الوصف</label>
                  <textarea [(ngModel)]="form.description" rows="3" placeholder="وصف مختصر عن مزود الخدمة"></textarea>
                </div>
              </div>

              @if (errorMsg()) {
                <div class="error-msg">⚠️ {{ errorMsg() }}</div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="closeModal()">إلغاء</button>
              <button class="btn-save" (click)="save()" [disabled]="saving()">
                {{ saving() ? 'جاري الحفظ...' : (editMode ? 'حفظ التعديلات' : 'إضافة') }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirm -->
      @if (deleteTarget()) {
        <div class="modal-overlay" (click)="deleteTarget.set(null)">
          <div class="modal modal-sm" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>تأكيد الحذف</h2>
              <button class="modal-close" (click)="deleteTarget.set(null)">✕</button>
            </div>
            <div class="modal-body">
              <p class="confirm-text">هل أنت متأكد من حذف <strong>{{ deleteTarget()?.name }}</strong>؟</p>
              <p class="confirm-sub">سيتم إيقاف تشغيله وليس حذفه نهائياً</p>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="deleteTarget.set(null)">إلغاء</button>
              <button class="btn-delete-confirm" (click)="doDelete()" [disabled]="saving()">
                {{ saving() ? 'جاري الحذف...' : 'نعم، احذف' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-page { padding: 2rem; max-width: 1400px; margin: 0 auto; font-family: 'Tajawal', sans-serif; direction: rtl; }

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-title { font-family: 'Amiri', serif; font-size: 1.8rem; color: #1A1208; margin: 0; }
    .page-sub { color: #7A6040; font-size: 0.9rem; margin: 0.2rem 0 0; }

    .btn-add {
      display: flex; align-items: center; gap: 0.5rem;
      background: #C9A84C; color: white; border: none;
      padding: 0.7rem 1.5rem; border-radius: 10px;
      font-family: 'Tajawal', sans-serif; font-size: 0.95rem;
      font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-add:hover { background: #8B6914; transform: translateY(-1px); }

    .filters-bar {
      display: flex; gap: 1rem; flex-wrap: wrap;
      background: #FFFDF8; border: 1px solid rgba(201,168,76,0.2);
      border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;
    }
    .search-wrap {
      display: flex; align-items: center; gap: 0.5rem;
      background: white; border: 1.5px solid rgba(201,168,76,0.3);
      border-radius: 8px; padding: 0.5rem 1rem; flex: 1; min-width: 200px;
    }
    .search-input { border: none; outline: none; font-family: 'Tajawal', sans-serif; font-size: 0.9rem; width: 100%; background: transparent; }
    .filter-select {
      padding: 0.5rem 1rem; border-radius: 8px;
      border: 1.5px solid rgba(201,168,76,0.3);
      font-family: 'Tajawal', sans-serif; font-size: 0.9rem;
      background: white; color: #3D2B10; cursor: pointer; outline: none;
    }

    .loading { display: flex; flex-direction: column; gap: 0.8rem; }
    .skeleton-row {
      height: 60px; border-radius: 8px;
      background: linear-gradient(90deg, #f0e8d8 25%, #faf5ee 50%, #f0e8d8 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer { to { background-position: -200% 0; } }

    .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid rgba(201,168,76,0.15); }
    .data-table { width: 100%; border-collapse: collapse; background: white; }
    .data-table thead tr { background: #FAF5EE; }
    .data-table th {
      padding: 1rem 0.8rem; text-align: right;
      font-size: 0.8rem; font-weight: 700; color: #7A6040;
      border-bottom: 2px solid rgba(201,168,76,0.2);
      white-space: nowrap;
    }
    .table-row { border-bottom: 1px solid rgba(201,168,76,0.1); transition: background 0.15s; }
    .table-row:hover { background: #FFFDF8; }
    .data-table td { padding: 0.85rem 0.8rem; font-size: 0.88rem; color: #3D2B10; }

    .td-id { color: #AAA; font-size: 0.8rem; }
    .name-cell { display: flex; align-items: center; gap: 0.7rem; }
    .name-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #C9A84C, #8B6914);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem; flex-shrink: 0;
    }
    .name-text { font-weight: 600; color: #1A1208; }
    .phone-text { font-size: 0.75rem; color: #7A6040; margin-top: 0.1rem; }
    .cat-badge {
      background: rgba(201,168,76,0.12); color: #8B6914;
      padding: 0.2rem 0.6rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 600; white-space: nowrap;
    }
    .td-loc { color: #7A6040; white-space: nowrap; }
    .rating-cell { display: flex; align-items: center; gap: 0.3rem; }
    .stars { color: #C9A84C; }
    .td-price { font-weight: 700; color: #8B6914; white-space: nowrap; }
    .td-reviews { color: #7A6040; }
    .status-badge {
      padding: 0.2rem 0.7rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 700;
    }
    .status-badge.active { background: rgba(34,197,94,0.1); color: #16A34A; }
    .status-badge.inactive { background: rgba(239,68,68,0.1); color: #DC2626; }
    .actions-cell { display: flex; gap: 0.4rem; }
    .btn-edit, .btn-delete {
      width: 32px; height: 32px; border-radius: 8px; border: none;
      cursor: pointer; font-size: 0.85rem; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-edit { background: rgba(201,168,76,0.1); }
    .btn-edit:hover { background: rgba(201,168,76,0.25); }
    .btn-delete { background: rgba(239,68,68,0.1); }
    .btn-delete:hover { background: rgba(239,68,68,0.2); }
    .empty-td { text-align: center; padding: 3rem; }
    .empty { color: #7A6040; font-size: 2rem; }
    .empty p { font-size: 0.9rem; margin-top: 0.5rem; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(26,18,8,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 1rem;
    }
    .modal {
      background: white; border-radius: 16px;
      width: 100%; max-width: 700px; max-height: 90vh;
      overflow-y: auto; box-shadow: 0 25px 60px rgba(26,18,8,0.3);
    }
    .modal-sm { max-width: 400px; }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.5rem; border-bottom: 1px solid rgba(201,168,76,0.2);
    }
    .modal-header h2 { font-family: 'Amiri', serif; font-size: 1.3rem; color: #1A1208; margin: 0; }
    .modal-close {
      width: 32px; height: 32px; border-radius: 50%; border: none;
      background: #FAF5EE; cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
    }
    .modal-body { padding: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .full-width { grid-column: 1 / -1; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #5A4020; }
    .form-group input, .form-group select, .form-group textarea {
      padding: 0.6rem 0.9rem; border-radius: 8px;
      border: 1.5px solid rgba(201,168,76,0.3);
      font-family: 'Tajawal', sans-serif; font-size: 0.9rem;
      outline: none; transition: border 0.2s; background: #FFFDF8;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: #C9A84C;
    }
    .error-msg {
      margin-top: 1rem; padding: 0.8rem 1rem; border-radius: 8px;
      background: rgba(239,68,68,0.1); color: #DC2626; font-size: 0.85rem;
    }
    .modal-footer {
      display: flex; justify-content: flex-start; gap: 0.8rem;
      padding: 1rem 1.5rem; border-top: 1px solid rgba(201,168,76,0.2);
    }
    .btn-cancel {
      padding: 0.6rem 1.5rem; border-radius: 8px;
      border: 1.5px solid rgba(201,168,76,0.3); background: transparent;
      color: #7A6040; font-family: 'Tajawal', sans-serif; cursor: pointer;
    }
    .btn-save {
      padding: 0.6rem 1.5rem; border-radius: 8px;
      background: #C9A84C; color: white; border: none;
      font-family: 'Tajawal', sans-serif; font-weight: 600; cursor: pointer;
    }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-delete-confirm {
      padding: 0.6rem 1.5rem; border-radius: 8px;
      background: #DC2626; color: white; border: none;
      font-family: 'Tajawal', sans-serif; font-weight: 600; cursor: pointer;
    }
    .confirm-text { font-size: 1rem; color: #1A1208; margin: 0 0 0.5rem; }
    .confirm-sub { font-size: 0.85rem; color: #7A6040; margin: 0; }
  `]
})
export class VendorsAdminComponent implements OnInit {
  private vendorSvc = inject(VendorService);

  allVendors  = signal<Vendor[]>([]);
  filtered    = signal<Vendor[]>([]);
  loading     = signal(true);
  saving      = signal(false);
  showModal   = signal(false);
  deleteTarget = signal<Vendor | null>(null);
  errorMsg    = signal('');
  editMode    = false;
  editId      = 0;

  categories  = CATEGORIES;
  searchQ     = '';
  filterCategory = 'الكل';
  filterRating   = '';
  sortBy         = 'rating';

  form: Partial<Vendor> = this.emptyForm();

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.vendorSvc.getAll().subscribe({
      next: v => { this.allVendors.set(v); this.applyFilters(); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilters() {
    let list = [...this.allVendors()];
    if (this.filterCategory !== 'الكل') list = list.filter(v => v.category === this.filterCategory);
    if (this.filterRating) list = list.filter(v => v.rating >= +this.filterRating);
    if (this.searchQ) {
      const q = this.searchQ.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q));
    }
    if (this.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (this.sortBy === 'price_asc') list.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (this.sortBy === 'price_desc') list.sort((a, b) => b.priceFrom - a.priceFrom);
    else if (this.sortBy === 'reviews') list.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (this.sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    this.filtered.set(list);
  }

  openModal(v?: Vendor) {
    this.errorMsg.set('');
    if (v) {
      this.editMode = true;
      this.editId = v.id;
      this.form = { ...v };
    } else {
      this.editMode = false;
      this.editId = 0;
      this.form = this.emptyForm();
    }
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.form.name || !this.form.category || !this.form.location) {
      this.errorMsg.set('برجاء ملء الحقول المطلوبة: الاسم، الفئة، الموقع');
      return;
    }
    this.saving.set(true);
    const obs = this.editMode
      ? this.vendorSvc.update(this.editId, this.form)
      : this.vendorSvc.create(this.form);

    obs.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: () => { this.saving.set(false); this.errorMsg.set('حصل خطأ، حاول تاني'); }
    });
  }

  confirmDelete(v: Vendor) { this.deleteTarget.set(v); }

  doDelete() {
    const v = this.deleteTarget();
    if (!v) return;
    this.saving.set(true);
    this.vendorSvc.delete(v.id).subscribe({
      next: () => { this.saving.set(false); this.deleteTarget.set(null); this.load(); },
      error: () => { this.saving.set(false); }
    });
  }

  emptyForm(): Partial<Vendor> {
    return { name: '', category: 'قاعات الأفراح', location: '', phone: '', priceFrom: 0, rating: 4.5, reviewCount: 0, description: '', isActive: true };
  }
}

// Add missing inject import
import { inject } from '@angular/core';