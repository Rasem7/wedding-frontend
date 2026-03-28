import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { Client, BudgetCategory } from '../../../core/models';
//#region  interface
interface CreateClientDto {
  groomName: string;
  brideName: string;
  groomPhone: string;
  bridePhone?: string;
  email?: string;
  address?: string;
  budget: number;
  budgetCategory?: BudgetCategory;
}
//#endregion
// @Component({
//   selector: 'app-clients-list',
//   standalone: true,
//   imports: [CommonModule, RouterLink, FormsModule],
//   template: `
//     <section class="clients-section">
//       <div class="section-header">
//         <div class="section-tag">العملاء</div>
//         <h2 class="section-title">قائمة <em>العرسان</em></h2>
//       </div>

//       <!-- Toolbar -->
//       <div class="toolbar">
//         <div class="search-bar">
//           <span>🔍</span>
//           <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
//                  placeholder="ابحث باسم أو رقم...">
//         </div>

//         <div class="filter-group">
//           @for (cat of budgetCategories; track cat.value) {
//             <button class="filter-btn"
//                     [class.active]="activeBudget === cat.value"
//                     (click)="filterByBudget(cat.value)">
//               {{ cat.label }}
//             </button>
//           }
//         </div>

//         <button class="btn-primary" (click)="openModal()">+ عميل جديد</button>
//       </div>

//       <!-- Table -->
//       <div class="clients-table">
//         @if (loading()) {
//           <div class="loading">جاري التحميل...</div>
//         } @else if (clients().length === 0) {
//           <div class="empty">لا يوجد عملاء</div>
//         } @else {
//           <table>
//             <thead>
//               <tr>
//                 <th>اسم العريسين</th>
//                 <th>رقم التواصل</th>
//                 <th>تاريخ الإضافة</th>
//                 <th>الميزانية</th>
//                 <th>التصنيف</th>
//                 <th>إجراء</th>
//               </tr>
//             </thead>
//             <tbody>
//               @for (c of clients(); track c.id) {
//                 <tr>
//                   <td>
//                     <div class="client-name-cell">
//                       <div class="client-avatar">{{ c.groomName[0] }}</div>
//                       <div>
//                         <div class="name">{{ c.groomName }} & {{ c.brideName }}</div>
//                         <div class="email">{{ c.email }}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>{{ c.groomPhone }}</td>
//                   <td>{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
//                   <td class="budget-cell">{{ c.budget | number }} ج</td>
//                   <td>
//                     <span class="budget-badge" [class]="c.budgetCategory.toLowerCase()">
//                       {{ budgetLabel(c.budgetCategory) }}
//                     </span>
//                   </td>
//                   <td>
//                     <div class="actions">
//                       <button class="btn-sm-primary" [routerLink]="['/clients', c.id]">عرض</button>
//                       <button class="btn-sm-danger" (click)="deleteClient(c)">حذف</button>
//                     </div>
//                   </td>
//                 </tr>
//               }
//             </tbody>
//           </table>
//           <!-- Pagination -->
//           <div class="pagination">
//             <button [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">‹</button>
//             <span>صفحة {{ currentPage }} من {{ totalPages }}</span>
//             <button [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">›</button>
//           </div>
//         }
//       </div>
//     </section>

//     <!-- Modal: Add Client -->
//     @if (showModal()) {
//       <div class="modal-overlay" (click)="closeModal()">
//         <div class="modal" (click)="$event.stopPropagation()">
//           <div class="modal-header">
//             <h3>💍 عميل جديد</h3>
//             <button (click)="closeModal()">✕</button>
//           </div>
//           <div class="modal-body">
//             <div class="form-grid">
//               <div class="form-group">
//                 <label>اسم العريس *</label>
//                 <input [(ngModel)]="newClient.groomName" placeholder="الاسم الكامل">
//               </div>
//               <div class="form-group">
//                 <label>اسم العروسة *</label>
//                 <input [(ngModel)]="newClient.brideName" placeholder="الاسم الكامل">
//               </div>
//               <div class="form-group">
//                 <label>موبايل العريس *</label>
//                 <input [(ngModel)]="newClient.groomPhone" placeholder="01xxxxxxxxx">
//               </div>
//               <div class="form-group">
//                 <label>موبايل العروسة</label>
//                 <input [(ngModel)]="newClient.bridePhone" placeholder="01xxxxxxxxx">
//               </div>
//               <div class="form-group full">
//                 <label>البريد الإلكتروني</label>
//                 <input [(ngModel)]="newClient.email" placeholder="example@mail.com">
//               </div>
//               <div class="form-group full">
//                 <label>الميزانية التقريبية (جنيه) *</label>
//                 <input type="number" [(ngModel)]="newClient.budget" placeholder="مثال: 80000">
//               </div>
//               <div class="form-group full">
//                 <label>العنوان</label>
//                 <input [(ngModel)]="newClient.address" placeholder="المنطقة / المدينة">
//               </div>
//             </div>
//             <button class="btn-primary" style="width:100%;margin-top:1rem"
//                     (click)="saveClient()" [disabled]="saving()">
//               {{ saving() ? 'جاري الحفظ...' : '✓ حفظ العميل' }}
//             </button>
//           </div>
//         </div>
//       </div>
//     }
//   `,
  // styles: [`
  //   .clients-section { padding: 2rem; max-width: 1200px; margin: 0 auto; }
  //   .section-header { text-align: center; margin-bottom: 2rem; }
  //   .section-tag {
  //     display: inline-block; background: rgba(201,168,76,0.12);
  //     border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
  //     padding: 0.3rem 1rem; border-radius: 50px;
  //     font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;
  //   }
  //   .section-title { font-family: 'Amiri', serif; font-size: 2rem; color: #1A1208; }
  //   .section-title em { color: #C9A84C; font-style: italic; }

  //   .toolbar {
  //     display: flex; gap: 1rem; margin-bottom: 1.5rem;
  //     flex-wrap: wrap; align-items: center;
  //   }
  //   .search-bar {
  //     display: flex; align-items: center; gap: 0.5rem;
  //     flex: 1; min-width: 250px;
  //     background: var(--white); border: 1.5px solid rgba(201,168,76,0.25);
  //     border-radius: 10px; padding: 0.6rem 1rem;
  //   }
  //   .search-bar input {
  //     border: none; background: none; outline: none;
  //     font-family: 'Tajawal', sans-serif; font-size: 0.9rem;
  //     color: var(--text); flex: 1;
  //   }
  //   .filter-group { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  //   .filter-btn {
  //     padding: 0.4rem 0.9rem; border-radius: 50px;
  //     border: 1.5px solid rgba(201,168,76,0.3);
  //     background: transparent; color: var(--text-light);
  //     font-family: 'Tajawal', sans-serif; font-size: 0.8rem;
  //     cursor: pointer; transition: all 0.2s;
  //   }
  //   .filter-btn.active { background: var(--gold); color: white; border-color: var(--gold); }

  //   .clients-table {
  //     background: var(--white);
  //     border: 1px solid rgba(201,168,76,0.15);
  //     border-radius: 18px; overflow: hidden;
  //     box-shadow: 0 4px 20px rgba(26,18,8,0.08);
  //   }
  //   .loading, .empty {
  //     text-align: center; padding: 3rem;
  //     color: var(--text-light); font-size: 1rem;
  //   }
  //   table { width: 100%; border-collapse: collapse; }
  //   thead tr { background: rgba(201,168,76,0.08); }
  //   th {
  //     padding: 1rem 1.2rem; text-align: right;
  //     font-size: 0.78rem; font-weight: 700;
  //     color: var(--text-light); text-transform: uppercase;
  //     border-bottom: 1px solid rgba(201,168,76,0.1);
  //   }
  //   td {
  //     padding: 1rem 1.2rem; font-size: 0.88rem;
  //     border-bottom: 1px solid rgba(201,168,76,0.06);
  //     vertical-align: middle;
  //   }
  //   tbody tr:hover { background: rgba(201,168,76,0.03); cursor: pointer; }
  //   tr:last-child td { border-bottom: none; }

  //   .client-name-cell { display: flex; align-items: center; gap: 0.8rem; }
  //   .client-avatar {
  //     width: 36px; height: 36px; border-radius: 50%;
  //     background: linear-gradient(135deg, #C9A84C, #E8C87A);
  //     display: flex; align-items: center; justify-content: center;
  //     font-size: 1rem; font-weight: 700; color: white; flex-shrink: 0;
  //   }
  //   .name { font-weight: 600; color: #1A1208; }
  //   .email { font-size: 0.78rem; color: var(--text-light); }
  //   .budget-cell { font-weight: 700; color: #8B6914; }

  //   .budget-badge {
  //     padding: 0.2rem 0.7rem; border-radius: 50px;
  //     font-size: 0.75rem; font-weight: 700;
  //   }
  //   .budget-badge.economical { background: rgba(45,138,78,0.12); color: #2D8A4E; }
  //   .budget-badge.standard   { background: rgba(26,86,196,0.12); color: #1A56C4; }
  //   .budget-badge.premium    { background: rgba(201,168,76,0.15); color: #8B6914; }
  //   .budget-badge.luxury     { background: rgba(197,115,122,0.12); color: #C5373A; }

  //   .actions { display: flex; gap: 0.4rem; }
  //   .btn-sm-primary {
  //     padding: 0.35rem 0.8rem; border-radius: 7px;
  //     background: var(--gold); color: white;
  //     border: none; font-family: 'Tajawal', sans-serif;
  //     font-size: 0.8rem; font-weight: 600; cursor: pointer;
  //   }
  //   .btn-sm-danger {
  //     padding: 0.35rem 0.8rem; border-radius: 7px;
  //     background: rgba(197,115,122,0.1); color: #C5373A;
  //     border: 1px solid rgba(197,115,122,0.3);
  //     font-family: 'Tajawal', sans-serif; font-size: 0.8rem; cursor: pointer;
  //   }
  //   .pagination {
  //     display: flex; align-items: center; justify-content: center;
  //     gap: 1rem; padding: 1rem;
  //     border-top: 1px solid rgba(201,168,76,0.1);
  //     font-size: 0.85rem; color: var(--text-light);
  //   }
  //   .pagination button {
  //     width: 32px; height: 32px; border-radius: 8px;
  //     border: 1px solid rgba(201,168,76,0.3); background: none;
  //     cursor: pointer; font-size: 1rem; color: #8B6914;
  //   }
  //   .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }

  //   /* MODAL */
  //   .modal-overlay {
  //     position: fixed; inset: 0; z-index: 2000;
  //     background: rgba(26,18,8,0.55);
  //     backdrop-filter: blur(4px);
  //     display: flex; align-items: center; justify-content: center; padding: 1rem;
  //   }
  //   .modal {
  //     background: var(--white); border-radius: 22px;
  //     padding: 2rem; max-width: 560px; width: 100%;
  //     max-height: 90vh; overflow-y: auto;
  //     box-shadow: 0 30px 80px rgba(0,0,0,0.25);
  //     animation: modalIn 0.3s ease;
  //   }
  //   @keyframes modalIn {
  //     from { opacity:0; transform: scale(0.95) translateY(10px); }
  //     to   { opacity:1; transform: none; }
  //   }
  //   .modal-header {
  //     display: flex; justify-content: space-between;
  //     align-items: center; margin-bottom: 1.5rem;
  //   }
  //   .modal-header h3 { font-family: 'Amiri', serif; font-size: 1.3rem; color: #1A1208; }
  //   .modal-header button {
  //     background: #FAF5EE; border: none; border-radius: 8px;
  //     width: 32px; height: 32px; cursor: pointer; font-size: 1rem;
  //   }
  //   .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  //   .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  //   .form-group.full { grid-column: 1/-1; }
  //   .form-group label { font-size: 0.83rem; font-weight: 600; color: #3D2B10; }
  //   .form-group input {
  //     padding: 0.72rem 1rem;
  //     border: 1.5px solid rgba(201,168,76,0.2); border-radius: 10px;
  //     background: #FAF5EE; font-family: 'Tajawal', sans-serif;
  //     font-size: 0.9rem; color: #3D2B10; outline: none;
  //   }
  //   .form-group input:focus { border-color: #C9A84C; background: white; }
  //   .btn-primary {
  //     background: #C9A84C; color: white; border: none;
  //     border-radius: 12px; padding: 0.85rem 2rem;
  //     font-family: 'Tajawal', sans-serif; font-size: 1rem;
  //     font-weight: 600; cursor: pointer; transition: all 0.2s;
  //   }
  //   .btn-primary:hover:not(:disabled) { background: #8B6914; }
  //   .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  // `]
// })
// export class ClientsListComponent implements OnInit {
//   private clientSvc = inject(ClientService);
//   private toast     = inject(ToastService);

//   clients   = signal<Client[]>([]);
//   loading   = signal(false);
//   saving    = signal(false);
//   showModal = signal(false);

//   searchQuery  = '';
//   activeBudget = '';
//   currentPage  = 1;
//   pageSize     = 10;
//   totalPages   = 1;

//   newClient = this.emptyClient();

//   budgetCategories = [
//     { value: '', label: 'الكل' },
//     { value: 'Economical', label: '🟢 اقتصادي' },
//     { value: 'Standard',   label: '🔵 عادي' },
//     { value: 'Premium',    label: '🟡 بريميوم' },
//     { value: 'Luxury',     label: '🔴 فاخر' },
//   ];

//   ngOnInit() { this.load(); }

// load() {
//   this.loading.set(true);
//   this.clientSvc.getAll({
//     page: this.currentPage,
//     pageSize: this.pageSize,
//     search: this.searchQuery || undefined,
//     budgetCategory: this.activeBudget || undefined,
//   }).subscribe({
//     next: res => {
//       this.clients.set(res);  // res هنا array
//       this.totalPages = Math.ceil(res.length / this.pageSize); // احسب الصفحات
//       this.loading.set(false);
//     },
//     error: () => {
//       this.toast.error('فشل تحميل العملاء');
//       this.loading.set(false);
//     }
//   });
// }

//   onSearch() { this.currentPage = 1; this.load(); }
//   filterByBudget(cat: string) { this.activeBudget = cat; this.currentPage = 1; this.load(); }
//   goToPage(p: number) { this.currentPage = p; this.load(); }

//   openModal()  { this.newClient = this.emptyClient(); this.showModal.set(true); }
//   closeModal() { this.showModal.set(false); }

//   saveClient() {
//     if (!this.newClient.groomName || !this.newClient.brideName || !this.newClient.groomPhone) {
//       this.toast.error('من فضلك املأ الحقول المطلوبة');
//       return;
//     }
//     this.saving.set(true);
//     this.clientSvc.create(this.newClient).subscribe({
//       next: () => {
//         this.toast.success('✅ تم إضافة العميل بنجاح');
//         this.closeModal();
//         this.load();
//         this.saving.set(false);
//       },
//       error: () => {
//         this.toast.error('حصل خطأ في الحفظ');
//         this.saving.set(false);
//       }
//     });
//   }

//   deleteClient(c: Client) {
//     if (!confirm(`هتحذف ${c.groomName} و ${c.brideName}؟`)) return;
//     this.clientSvc.delete(c.id).subscribe({
//       next: () => { this.toast.success('تم الحذف'); this.load(); },
//       error: () => this.toast.error('فشل الحذف'),
//     });
//   }

//   budgetLabel(cat: BudgetCategory) {
//     const map: Record<BudgetCategory, string> = {
//       Economical: 'اقتصادي', Standard: 'عادي', Premium: 'بريميوم', Luxury: 'فاخر'
//     };
//     return map[cat] ?? cat;
//   }

//   private emptyClient() {
//     return { groomName: '', brideName: '', groomPhone: '', bridePhone: '', email: '', address: '', budget: 0 };
//   }
// }


// --------------------------------------------------------


@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {
  private clientSvc = inject(ClientService);
  private toast     = inject(ToastService);

  clients   = signal<Client[]>([]);
  loading   = signal(false);
  saving    = signal(false);
  showModal = signal(false);
editing = signal(false);
  searchQuery  = '';
  activeBudget = '';
  currentPage  = 1;
  pageSize     = 10;
  totalPages   = 1;

  // newClient = this.emptyClient();
newClient: CreateClientDto = this.emptyClient();
  budgetCategories = [
    { value: '', label: 'الكل' },
    { value: 'Economical', label: '🟢 اقتصادي' },
    { value: 'Standard',   label: '🔵 عادي' },
    { value: 'Premium',    label: '🟡 بريميوم' },
    { value: 'Luxury',     label: '🔴 فاخر' },
  ];

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.clientSvc.getAll({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchQuery || undefined,
      budgetCategory: this.activeBudget || undefined,
    }).subscribe({
      next: res => {
        this.clients.set(res);
        this.totalPages = Math.ceil(res.length / this.pageSize);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('فشل تحميل العملاء');
        this.loading.set(false);
      }
    });
  }

  onSearch() { this.currentPage = 1; this.load(); }
  filterByBudget(cat: string) { this.activeBudget = cat; this.currentPage = 1; this.load(); }
  goToPage(p: number) { this.currentPage = p; this.load(); }

  openModal()  { this.newClient = this.emptyClient(); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

saveClient() {
  // التحقق من الحقول المطلوبة
  if (!this.newClient.groomName || !this.newClient.brideName || !this.newClient.groomPhone) {
    this.toast.error('من فضلك املأ الحقول المطلوبة');
    return;
  }

  this.saving.set(true);

  // تجهيز DTO متوافق مع API
  const dto: CreateClientDto = {
    groomName: this.newClient.groomName!,
    brideName: this.newClient.brideName!,
    groomPhone: this.newClient.groomPhone!,
    bridePhone: this.newClient.bridePhone,
    email: this.newClient.email,
    address: this.newClient.address,
    budget: this.newClient.budget!,
    budgetCategory: this.newClient.budgetCategory
  };

  if (this.editing()) {
    // تعديل العميل
    this.clientSvc.update((this.newClient as Client).id!, dto).subscribe({
      next: () => {
        this.toast.success('✅ تم تعديل العميل بنجاح');
        this.closeModal();
        this.load();
        this.saving.set(false);
        this.editing.set(false);
      },
      error: () => {
        this.toast.error('حصل خطأ في التعديل');
        this.saving.set(false);
      }
    });
  } else {
    // إضافة عميل جديد
    this.clientSvc.create(dto).subscribe({
      next: () => {
        this.toast.success('✅ تم إضافة العميل بنجاح');
        this.closeModal();
        this.load();
        this.saving.set(false);
      },
      error: () => {
        this.toast.error('حصل خطأ في الحفظ');
        this.saving.set(false);
      }
    });
  }
}
EditClient(c: Client) {
   this.newClient = { ...c }; // انسخي بيانات العميل اللي عايزة تعدليها
  this.editing.set(true);      // وضع التعديل
  this.showModal.set(true);    // افتحي المودال
}
  deleteClient(c: Client) {
    if (!confirm(`هتحذف ${c.groomName} و ${c.brideName}؟`)) return;
    this.clientSvc.delete(c.id).subscribe({
      next: () => { this.toast.success('تم الحذف'); this.load(); },
      error: () => this.toast.error('فشل الحذف'),
    });
  }

  budgetLabel(cat: BudgetCategory) {
    const map: Record<BudgetCategory, string> = {
      Economical: 'اقتصادي', Standard: 'عادي', Premium: 'بريميوم', Luxury: 'فاخر'
    };
    return map[cat] ?? cat;
  }

 private emptyClient(): CreateClientDto {
  return {
    groomName: '',
    brideName: '',
    groomPhone: '',
    bridePhone: '',
    email: '',
    address: '',
    budget: 0,
  };
}
}