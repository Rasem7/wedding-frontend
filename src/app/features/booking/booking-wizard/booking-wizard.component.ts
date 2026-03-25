// import { Component, signal, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { ToastService } from '../../../shared/components/toast/toast.service';
// import { ClientService, BookingService } from '../../../core/services/api.service';

// const SERVICES = [
//   { id: 1, icon: '🏛️', name: 'قاعات الأفراح' },
//   { id: 2, icon: '📸', name: 'التصوير والفيديو' },
//   { id: 3, icon: '🌸', name: 'تنسيق الزهور' },
//   { id: 4, icon: '🍽️', name: 'الكيترينج' },
//   { id: 5, icon: '💄', name: 'كوافير ومكياج' },
//   { id: 6, icon: '🎵', name: 'الموسيقى' },
//   { id: 7, icon: '👗', name: 'فساتين الزفاف' },
//   { id: 8, icon: '🎂', name: 'الحلويات' },
// ];

// @Component({
//   selector: 'app-booking-wizard',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   template: `
//     <section class="booking-section">
//       <div class="section-header">
//         <div class="section-tag">حجز جديد</div>
//         <h2 class="section-title">سجّل <em>فرحك</em></h2>
//       </div>

//       <div class="booking-form">
//         <!-- Steps Bar -->
//         <div class="steps-bar">
//           @for (s of steps; track s.num) {
//             <div class="step-tab" [class.active]="currentStep === s.num" [class.done]="currentStep > s.num"
//                  (click)="currentStep > s.num && goTo(s.num)">
//               <span class="step-circle">{{ currentStep > s.num ? '✓' : s.num }}</span>
//               <span class="step-label">{{ s.label }}</span>
//             </div>
//           }
//         </div>

//         <!-- Step 1: بيانات العريسين -->
//         @if (currentStep === 1) {
//           <div class="step-content">
//             <div class="form-grid">
//               <div class="form-group">
//                 <label>اسم العريس *</label>
//                 <input [(ngModel)]="form.groomName" placeholder="الاسم الكامل">
//               </div>
//               <div class="form-group">
//                 <label>اسم العروسة *</label>
//                 <input [(ngModel)]="form.brideName" placeholder="الاسم الكامل">
//               </div>
//               <div class="form-group">
//                 <label>موبايل العريس *</label>
//                 <input [(ngModel)]="form.groomPhone" type="tel" placeholder="01xxxxxxxxx">
//               </div>
//               <div class="form-group">
//                 <label>موبايل العروسة</label>
//                 <input [(ngModel)]="form.bridePhone" type="tel" placeholder="01xxxxxxxxx">
//               </div>
//               <div class="form-group full">
//                 <label>البريد الإلكتروني</label>
//                 <input [(ngModel)]="form.email" type="email" placeholder="example@mail.com">
//               </div>
//               <div class="form-group full">
//                 <label>الميزانية التقريبية (جنيه)</label>
//                 <input [(ngModel)]="form.budget" type="number" placeholder="مثال: 80000">
//               </div>
//               <div class="form-group full">
//                 <label>العنوان</label>
//                 <input [(ngModel)]="form.address" placeholder="المنطقة / المدينة">
//               </div>
//             </div>
//             <button class="btn-next" (click)="next()">التالي ←</button>
//           </div>
//         }

//         <!-- Step 2: تفاصيل الحفل -->
//         @if (currentStep === 2) {
//           <div class="step-content">
//             <div class="form-grid">
//               <div class="form-group">
//                 <label>تاريخ الفرح *</label>
//                 <input [(ngModel)]="form.weddingDate" type="date">
//               </div>
//               <div class="form-group">
//                 <label>وقت الحفل</label>
//                 <input [(ngModel)]="form.weddingTime" type="time">
//               </div>
//               <div class="form-group">
//                 <label>عدد المدعوين</label>
//                 <input [(ngModel)]="form.guestCount" type="number" placeholder="عدد الضيوف">
//               </div>
//               <div class="form-group">
//                 <label>نوع الحفل</label>
//                 <select [(ngModel)]="form.eventType">
//                   <option value="FullWedding">حفل زفاف كامل</option>
//                   <option value="Cocktail">كوكتيل</option>
//                   <option value="Engagement">حفل خطوبة</option>
//                   <option value="SmallParty">سهرة صغيرة</option>
//                 </select>
//               </div>
//               <div class="form-group full">
//                 <label>القاعة / المكان</label>
//                 <input [(ngModel)]="form.venue" placeholder="اسم المكان أو المنطقة">
//               </div>
//               <div class="form-group full">
//                 <label>ملاحظات إضافية</label>
//                 <textarea [(ngModel)]="form.notes" placeholder="أي تفاصيل تانية..."></textarea>
//               </div>
//             </div>
//             <div class="btn-row">
//               <button class="btn-back" (click)="goTo(1)">→ رجوع</button>
//               <button class="btn-next" (click)="next()">التالي ←</button>
//             </div>
//           </div>
//         }

//         <!-- Step 3: الخدمات -->
//         @if (currentStep === 3) {
//           <div class="step-content">
//             <p class="step-hint">اختار الخدمات اللي محتاجها:</p>
//             <div class="services-check-grid">
//               @for (s of allServices; track s.id) {
//                 <label class="service-check" [class.checked]="isSelected(s.id)">
//                   <input type="checkbox" [checked]="isSelected(s.id)" (change)="toggleService(s.id)">
//                   <span>{{ s.icon }}</span>
//                   <span>{{ s.name }}</span>
//                 </label>
//               }
//             </div>
//             <div class="btn-row">
//               <button class="btn-back" (click)="goTo(2)">→ رجوع</button>
//               <button class="btn-next" (click)="next()">التالي ←</button>
//             </div>
//           </div>
//         }

//         <!-- Step 4: تأكيد -->
//         @if (currentStep === 4) {
//           <div class="step-content">
//             <div class="summary">
//               <div class="summary-row"><span>العريس</span><span>{{ form.groomName || '—' }}</span></div>
//               <div class="summary-row"><span>العروسة</span><span>{{ form.brideName || '—' }}</span></div>
//               <div class="summary-row"><span>الموبايل</span><span>{{ form.groomPhone || '—' }}</span></div>
//               <div class="summary-row"><span>تاريخ الفرح</span><span>{{ form.weddingDate || '—' }}</span></div>
//               <div class="summary-row"><span>عدد الضيوف</span><span>{{ form.guestCount || '—' }}</span></div>
//               <div class="summary-row"><span>نوع الحفل</span><span>{{ eventTypeLabel() }}</span></div>
//               <div class="summary-row"><span>المكان</span><span>{{ form.venue || '—' }}</span></div>
//               <div class="summary-row"><span>الميزانية</span><span>{{ form.budget | number }} ج</span></div>
//               <div class="summary-row"><span>الخدمات</span><span>{{ selectedServicesLabels() }}</span></div>
//             </div>
//             <div class="btn-row">
//               <button class="btn-back" (click)="goTo(3)">→ رجوع</button>
//               <button class="btn-confirm" (click)="submit()" [disabled]="submitting()">
//                 {{ submitting() ? 'جاري الإرسال...' : '✓ تأكيد الحجز' }}
//               </button>
//             </div>
//           </div>
//         }
//       </div>
//     </section>
//   `,
//   styles: [`
//     .booking-section { padding: 3rem 2rem 5rem; max-width: 780px; margin: 0 auto; }
//     .section-header { text-align: center; margin-bottom: 2rem; }
//     .section-tag {
//       display: inline-block; background: rgba(201,168,76,0.12);
//       border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
//       padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;
//     }
//     .section-title { font-family: 'Amiri', serif; font-size: 2rem; color: #1A1208; }
//     .section-title em { color: #C9A84C; font-style: italic; }
//     .booking-form {
//       background: #FFFDF8; border: 1px solid rgba(201,168,76,0.2);
//       border-radius: 24px; padding: 2.5rem;
//       box-shadow: 0 10px 40px rgba(26,18,8,0.1);
//     }
//     .steps-bar { display: flex; margin-bottom: 2.5rem; border-radius: 12px; overflow: hidden; border: 1px solid rgba(201,168,76,0.2); }
//     .step-tab {
//       flex: 1; padding: 0.75rem 0.5rem; text-align: center;
//       background: #FAF5EE; cursor: default; transition: all 0.2s;
//       border-left: 1px solid rgba(201,168,76,0.2); display: flex;
//       align-items: center; justify-content: center; gap: 0.4rem;
//     }
//     .step-tab:first-child { border-left: none; }
//     .step-tab.active { background: #C9A84C; color: white; }
//     .step-tab.done { background: rgba(201,168,76,0.15); color: #8B6914; cursor: pointer; }
//     .step-circle {
//       width: 22px; height: 22px; border-radius: 50%;
//       background: rgba(255,255,255,0.3); display: inline-flex;
//       align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;
//     }
//     .step-label { font-size: 0.78rem; font-weight: 600; }
//     .step-content { animation: fadeIn 0.3s ease; }
//     @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
//     .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem; }
//     .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
//     .form-group.full { grid-column: 1 / -1; }
//     label { font-size: 0.84rem; font-weight: 600; color: #3D2B10; }
//     input, select, textarea {
//       padding: 0.75rem 1rem; border: 1.5px solid rgba(201,168,76,0.2);
//       border-radius: 10px; background: #FAF5EE;
//       font-family: 'Tajawal', sans-serif; font-size: 0.93rem;
//       color: #3D2B10; outline: none; transition: border-color 0.2s; width: 100%;
//     }
//     input:focus, select:focus, textarea:focus { border-color: #C9A84C; background: white; }
//     textarea { min-height: 90px; resize: vertical; }
//     .step-hint { color: #7A6040; font-size: 0.9rem; margin-bottom: 1rem; }
//     .services-check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; margin-bottom: 1.5rem; }
//     .service-check {
//       display: flex; align-items: center; gap: 0.6rem;
//       padding: 0.75rem; background: #FAF5EE; border-radius: 10px;
//       cursor: pointer; border: 1.5px solid transparent; transition: all 0.2s; font-size: 0.9rem;
//     }
//     .service-check:hover { border-color: rgba(201,168,76,0.3); }
//     .service-check.checked { border-color: #C9A84C; background: rgba(201,168,76,0.08); }
//     .service-check input { width: auto; accent-color: #C9A84C; }
//     .summary {
//       background: #FAF5EE; border: 1px solid rgba(201,168,76,0.2);
//       border-radius: 12px; padding: 1.2rem; margin-bottom: 1.5rem;
//     }
//     .summary-row {
//       display: flex; justify-content: space-between;
//       padding: 0.5rem 0; border-bottom: 1px solid rgba(201,168,76,0.1); font-size: 0.9rem;
//     }
//     .summary-row:last-child { border-bottom: none; }
//     .summary-row span:first-child { color: #7A6040; }
//     .summary-row span:last-child { font-weight: 600; color: #1A1208; }
//     .btn-next, .btn-confirm {
//       width: 100%; padding: 0.88rem; background: #C9A84C; color: white;
//       border: none; border-radius: 12px; font-family: 'Tajawal', sans-serif;
//       font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
//     }
//     .btn-next:hover, .btn-confirm:hover:not(:disabled) { background: #8B6914; }
//     .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
//     .btn-back {
//       padding: 0.88rem 1.5rem; background: transparent; color: #8B6914;
//       border: 2px solid #C9A84C; border-radius: 12px;
//       font-family: 'Tajawal', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer;
//     }
//     .btn-back:hover { background: rgba(201,168,76,0.1); }
//     .btn-row { display: flex; gap: 1rem; }
//     .btn-row .btn-back { flex: 1; }
//     .btn-row .btn-next, .btn-row .btn-confirm { flex: 2; }
//     @media (max-width: 600px) {
//       .form-grid { grid-template-columns: 1fr; }
//       .services-check-grid { grid-template-columns: 1fr; }
//       .steps-bar .step-label { display: none; }
//     }
//   `]
// })
// export class BookingWizardComponent {
//   private clientSvc  = inject(ClientService);
//   private bookingSvc = inject(BookingService);
//   private router     = inject(Router);
//   private toast      = inject(ToastService);

//   currentStep = 1;
//   submitting  = signal(false);
//   allServices = SERVICES;
//   selectedServiceIds: number[] = [];

//   steps = [
//     { num: 1, label: 'بيانات العريسين' },
//     { num: 2, label: 'تفاصيل الحفل' },
//     { num: 3, label: 'الخدمات' },
//     { num: 4, label: 'تأكيد' },
//   ];

//   form = {
//     groomName: '', brideName: '', groomPhone: '', bridePhone: '',
//     email: '', address: '', budget: 0,
//     weddingDate: '', weddingTime: '',
//     guestCount: null as number | null,
//     eventType: 'FullWedding', venue: '', notes: '',
//   };

//   goTo(step: number) { this.currentStep = step; }

//   next() {
//     if (this.currentStep === 1) {
//       if (!this.form.groomName || !this.form.brideName || !this.form.groomPhone) {
//         this.toast.error('من فضلك أدخل اسم العريسين والموبايل');
//         return;
//       }
//     }
//     if (this.currentStep === 2 && !this.form.weddingDate) {
//       this.toast.error('من فضلك حدد تاريخ الفرح');
//       return;
//     }
//     this.currentStep++;
//   }

//   toggleService(id: number) {
//     const idx = this.selectedServiceIds.indexOf(id);
//     idx === -1 ? this.selectedServiceIds.push(id) : this.selectedServiceIds.splice(idx, 1);
//   }

//   isSelected(id: number) { return this.selectedServiceIds.includes(id); }

//   submit() {
//     this.submitting.set(true);

//     // Step 1: Create Client
//     this.clientSvc.create({
//       groomName:  this.form.groomName,
//       brideName:  this.form.brideName,
//       groomPhone: this.form.groomPhone,
//       bridePhone: this.form.bridePhone,
//       email:      this.form.email,
//       address:    this.form.address,
//       budget:     this.form.budget,
//     }).subscribe({
//       next: (client) => {
//         // Step 2: Create Booking
//         this.bookingSvc.create({
//           clientId:    client.id,
//           weddingDate: new Date(this.form.weddingDate).toISOString(),
//           weddingTime: this.form.weddingTime,
//           venue:       this.form.venue,
//           guestCount:  this.form.guestCount ?? 0,
//           eventType:   this.form.eventType,
//           totalAmount: this.form.budget,
//           notes:       this.form.notes,
//         }).subscribe({
//           next: () => {
//             this.toast.success('✅ تم تسجيل الحجز بنجاح! هنتواصل معاك قريباً');
//             this.submitting.set(false);
//             this.router.navigate(['/dashboard']);
//           },
//           error: () => {
//             this.toast.error('حصل خطأ في إنشاء الحجز');
//             this.submitting.set(false);
//           }
//         });
//       },
//       error: () => {
//         this.toast.error('حصل خطأ في تسجيل البيانات');
//         this.submitting.set(false);
//       }
//     });
//   }

//   eventTypeLabel() {
//     const map: any = { FullWedding: 'حفل زفاف كامل', Cocktail: 'كوكتيل', Engagement: 'حفل خطوبة', SmallParty: 'سهرة صغيرة' };
//     return map[this.form.eventType] ?? '—';
//   }

//   selectedServicesLabels() {
//     if (!this.selectedServiceIds.length) return '—';
//     return this.allServices.filter(s => this.selectedServiceIds.includes(s.id)).map(s => s.name).join('، ');
//   }
// }

// --------------------------------------
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ClientService, BookingService } from '../../../core/services/api.service';

const SERVICES = [
  { id: 1, icon: '🏛️', name: 'قاعات الأفراح' },
  { id: 2, icon: '📸', name: 'التصوير والفيديو' },
  { id: 3, icon: '🌸', name: 'تنسيق الزهور' },
  { id: 4, icon: '🍽️', name: 'الكيترينج' },
  { id: 5, icon: '💄', name: 'كوافير ومكياج' },
  { id: 6, icon: '🎵', name: 'الموسيقى' },
  { id: 7, icon: '👗', name: 'فساتين الزفاف' },
  { id: 8, icon: '🎂', name: 'الحلويات' },
];

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [FormsModule, CommonModule],
 templateUrl: './booking-wizard.component.html',
styleUrls: ['./booking-wizard.component.css']
})
export class BookingWizardComponent {
  private clientSvc  = inject(ClientService);
  private bookingSvc = inject(BookingService);
  private router     = inject(Router);
  private toast      = inject(ToastService);

  currentStep = 1;
  submitting  = signal(false);
  allServices = SERVICES;
  selectedServiceIds: number[] = [];

  steps = [
    { num: 1, label: 'بيانات العريسين' },
    { num: 2, label: 'تفاصيل الحفل' },
    { num: 3, label: 'الخدمات' },
    { num: 4, label: 'تأكيد' },
  ];

  form = {
    groomName: '', brideName: '', groomPhone: '', bridePhone: '',
    email: '', address: '', budget: 0,
    weddingDate: '', weddingTime: '',
    guestCount: null as number | null,
    eventType: 'FullWedding', venue: '', notes: '',
  };

  goTo(step: number) { this.currentStep = step; }

  next() {
    if (this.currentStep === 1) {
      if (!this.form.groomName || !this.form.brideName || !this.form.groomPhone) {
        this.toast.error('من فضلك أدخل اسم العريسين والموبايل');
        return;
      }
    }
    if (this.currentStep === 2) {
    if (!this.form.weddingDate || !this.form.eventType || !this.form.guestCount) {
        this.toast.error('من فضلك أكمل بيانات الفرح: التاريخ، عدد المدعوين، ونوع الحفل.');
        return;
    }

    const selectedDate = new Date(this.form.weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        this.toast.error('تاريخ الفرح لا يمكن أن يكون قبل اليوم');
        return;
    }

    }
   if (this.currentStep === 3) {
    if (!this.selectedServiceIds || this.selectedServiceIds.length === 0) {
        this.toast.error('من فضلك اختر خدمة واحدة على الأقل للاستمرار.');
        return;
    }

}
    this.currentStep++;
  }

  toggleService(id: number) {
    const idx = this.selectedServiceIds.indexOf(id);
    idx === -1 ? this.selectedServiceIds.push(id) : this.selectedServiceIds.splice(idx, 1);
  }

  isSelected(id: number) { return this.selectedServiceIds.includes(id); }

  submit() {
    this.submitting.set(true);

    this.clientSvc.create({
      groomName:  this.form.groomName,
      brideName:  this.form.brideName,
      groomPhone: this.form.groomPhone,
      bridePhone: this.form.bridePhone,
      email:      this.form.email,
      address:    this.form.address,
      budget:     this.form.budget,
    }).subscribe({
      next: (client) => {
        this.bookingSvc.create({
          clientId:    client.id,
          weddingDate: new Date(this.form.weddingDate).toISOString(),
          weddingTime: this.form.weddingTime,
          venue:       this.form.venue,
          guestCount:  this.form.guestCount ?? 0,
          eventType:   this.form.eventType,
          totalAmount: this.form.budget,
          notes:       this.form.notes,
        }).subscribe({
          next: () => {
            this.toast.success('✅ تم تسجيل الحجز بنجاح! هنتواصل معاك قريباً');
            this.submitting.set(false);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.toast.error('حصل خطأ في إنشاء الحجز');
            this.submitting.set(false);
          }
        });
      },
      error: () => {
        this.toast.error('حصل خطأ في تسجيل البيانات');
        this.submitting.set(false);
      }
    });
  }

  eventTypeLabel() {
    const map: any = {
      FullWedding: 'حفل زفاف كامل',
      Cocktail: 'كوكتيل',
      Engagement: 'حفل خطوبة',
      SmallParty: 'سهرة صغيرة'
    };
    return map[this.form.eventType] ?? '—';
  }

  selectedServicesLabels() {
    if (!this.selectedServiceIds.length) return '—';
    return this.allServices
      .filter(s => this.selectedServiceIds.includes(s.id))
      .map(s => s.name)
      .join('، ');
  }
}