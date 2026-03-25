// import { Component, OnInit, signal } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

// const MOCK_VENDORS: any[] = [
//   {
//     id: 1, name: 'بالاس ويدينج هول', category: 'قاعات الأفراح',
//     location: 'مدينة نصر، القاهرة', rating: 4.9, reviewCount: 234,
//     emoji: '🏛️', color: '#FFF5E6', phone: '010-1234-5678', capacity: '١٢٠٠ ضيف',
//     description: 'أفخم قاعة في القاهرة بسعة ١٢٠٠ ضيف وتصميم عصري فاخر',
//     packages: [
//       { name: 'باقة بيزيك', price: '٣٠,٠٠٠', details: 'القاعة فقط' },
//       { name: 'باقة ستاندر', price: '٥٠,٠٠٠', details: 'قاعة + كيترينج' },
//       { name: 'باقة بريميوم', price: '٨٠,٠٠٠', details: 'قاعة + كيترينج + زهور + إضاءة' },
//     ],
//     reviews: [
//       { name: 'مريم أحمد', stars: 5, text: 'ولا في الخيال! القاعة جميلة جداً والخدمة ممتازة' },
//       { name: 'محمد علي', stars: 5, text: 'من أفضل القاعات في مصر، استحقت كل قرش' },
//     ]
//   },
//   {
//     id: 2, name: 'ستوديو ليلى فوتو', category: 'التصوير',
//     location: 'المعادي، القاهرة', rating: 4.8, reviewCount: 189,
//     emoji: '📸', color: '#F0F5FF', phone: '011-9876-5432', capacity: '—',
//     description: 'تصوير فوتوغرافي احترافي مع فريق متميز وأحدث المعدات',
//     packages: [
//       { name: 'باقة صور', price: '٨,٠٠٠', details: '٦ ساعات + ٢٠٠ صورة' },
//       { name: 'باقة فيديو', price: '١٢,٠٠٠', details: 'تصوير + مونتاج' },
//       { name: 'باقة كاملة', price: '٢٠,٠٠٠', details: 'صور + فيديو + ألبوم فاخر' },
//     ],
//     reviews: [
//       { name: 'سارة محمود', stars: 5, text: 'الصور طلعت تحفة، المصور محترف جداً' },
//       { name: 'كريم حسن', stars: 4, text: 'خدمة ممتازة وأسعار مناسبة' },
//     ]
//   },
// ];

// @Component({
//   selector: 'app-vendor-detail',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   template: `
//     @if (vendor()) {
//       <div class="vendor-detail-header">
//         <button class="back-btn" routerLink="/vendors">← رجوع</button>
//         <span class="detail-emoji">{{ vendor()!.emoji }}</span>
//         <div class="detail-name">{{ vendor()!.name }}</div>
//         <div class="detail-cat">{{ vendor()!.category }} · {{ vendor()!.location }}</div>
//       </div>

//       <div class="detail-body">
//         <div class="detail-tabs">
//           @for (tab of tabs; track tab.key) {
//             <button class="tab-btn" [class.active]="activeTab === tab.key" (click)="activeTab = tab.key">
//               {{ tab.label }}
//             </button>
//           }
//         </div>

//         @if (activeTab === 'info') {
//           <p class="desc">{{ vendor()!.description }}</p>
//           <div class="info-grid">
//             <div class="info-item"><div class="info-label">التقييم</div><div class="info-val">⭐ {{ vendor()!.rating }} ({{ vendor()!.reviewCount }} تقييم)</div></div>
//             <div class="info-item"><div class="info-label">الطاقة</div><div class="info-val">{{ vendor()!.capacity }}</div></div>
//             <div class="info-item"><div class="info-label">التواصل</div><div class="info-val">{{ vendor()!.phone }}</div></div>
//             <div class="info-item"><div class="info-label">الموقع</div><div class="info-val">📍 {{ vendor()!.location }}</div></div>
//           </div>
//         }

//         @if (activeTab === 'packages') {
//           <div class="packages-list">
//             @for (p of vendor()!.packages; track p.name) {
//               <div class="package-card">
//                 <div class="package-top">
//                   <span class="package-name">{{ p.name }}</span>
//                   <span class="package-price">{{ p.price }} ج</span>
//                 </div>
//                 <div class="package-details">{{ p.details }}</div>
//               </div>
//             }
//           </div>
//         }

//         @if (activeTab === 'reviews') {
//           @for (r of vendor()!.reviews; track r.name) {
//             <div class="review-card">
//               <div class="review-top">
//                 <span class="review-name">{{ r.name }}</span>
//                 <span class="review-stars">{{ '★'.repeat(r.stars) }}</span>
//               </div>
//               <p class="review-text">{{ r.text }}</p>
//             </div>
//           }
//         }

//         <button class="btn-book-now" routerLink="/booking">احجز الآن</button>
//       </div>
//     } @else {
//       <div class="not-found">مزود الخدمة مش موجود</div>
//     }
//   `,
//   styles: [`
//     .vendor-detail-header {
//       background: linear-gradient(135deg, #1A1208, #2D2010);
//       padding: 3rem 2rem; text-align: center; color: white; position: relative;
//     }
//     .back-btn {
//       position: absolute; top: 1.5rem; right: 1.5rem;
//       background: rgba(255,255,255,0.1); color: white; border: none;
//       border-radius: 8px; padding: 0.4rem 0.9rem; cursor: pointer;
//       font-family: 'Tajawal', sans-serif; font-size: 0.85rem;
//     }
//     .back-btn:hover { background: rgba(255,255,255,0.2); }
//     .detail-emoji { font-size: 5rem; display: block; margin-bottom: 1rem; }
//     .detail-name { font-family: 'Amiri', serif; font-size: 2rem; color: #E8C87A; margin-bottom: 0.3rem; }
//     .detail-cat { color: rgba(255,255,255,0.6); font-size: 0.9rem; }

//     .detail-body { padding: 2rem; max-width: 700px; margin: 0 auto; }
//     .detail-tabs {
//       display: flex; border-bottom: 1px solid rgba(201,168,76,0.2); margin-bottom: 1.5rem;
//     }
//     .tab-btn {
//       padding: 0.7rem 1.2rem; border: none; background: none;
//       font-family: 'Tajawal', sans-serif; font-size: 0.9rem; font-weight: 500;
//       color: #7A6040; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s;
//     }
//     .tab-btn.active { color: #8B6914; border-bottom-color: #C9A84C; }

//     .desc { color: #7A6040; line-height: 1.7; margin-bottom: 1.5rem; }
//     .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
//     .info-item { background: #FAF5EE; border-radius: 10px; padding: 1rem; }
//     .info-label { font-size: 0.75rem; color: #7A6040; font-weight: 600; text-transform: uppercase; margin-bottom: 0.3rem; }
//     .info-val { font-size: 0.95rem; color: #1A1208; font-weight: 600; }

//     .packages-list { display: flex; flex-direction: column; gap: 1rem; }
//     .package-card { background: #FAF5EE; border-radius: 12px; padding: 1.2rem; border: 1px solid rgba(201,168,76,0.15); }
//     .package-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
//     .package-name { font-weight: 700; color: #1A1208; }
//     .package-price { font-weight: 700; color: #8B6914; }
//     .package-details { font-size: 0.85rem; color: #7A6040; }

//     .review-card { padding: 1rem; border-bottom: 1px solid rgba(201,168,76,0.1); }
//     .review-top { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
//     .review-name { font-weight: 600; font-size: 0.9rem; color: #1A1208; }
//     .review-stars { color: #C9A84C; }
//     .review-text { font-size: 0.85rem; color: #7A6040; line-height: 1.6; }

//     .btn-book-now {
//       width: 100%; margin-top: 2rem; padding: 0.9rem;
//       background: #C9A84C; color: white; border: none; border-radius: 12px;
//       font-family: 'Tajawal', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer;
//     }
//     .btn-book-now:hover { background: #8B6914; }
//     .not-found { text-align: center; padding: 4rem; color: #7A6040; }
//   `]
// })
// export class VendorDetailComponent implements OnInit {
//   vendor = signal<any>(null);
//   activeTab = 'info';
//   tabs = [
//     { key: 'info', label: 'معلومات' },
//     { key: 'packages', label: 'الباقات' },
//     { key: 'reviews', label: 'التقييمات' },
//   ];

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit() {
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//     this.vendor.set(MOCK_VENDORS.find(v => v.id === id) ?? null);
//   }
// }


// -------------------------------------------------------
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const MOCK_VENDORS: any[] = [
  {
    id: 1, name: 'بالاس ويدينج هول', category: 'قاعات الأفراح',
    location: 'مدينة نصر، القاهرة', rating: 4.9, reviewCount: 234,
    emoji: '🏛️', color: '#FFF5E6', phone: '010-1234-5678', capacity: '١٢٠٠ ضيف',
    description: 'أفخم قاعة في القاهرة بسعة ١٢٠٠ ضيف وتصميم عصري فاخر',
    packages: [
      { name: 'باقة بيزيك', price: '٣٠,٠٠٠', details: 'القاعة فقط' },
      { name: 'باقة ستاندر', price: '٥٠,٠٠٠', details: 'قاعة + كيترينج' },
      { name: 'باقة بريميوم', price: '٨٠,٠٠٠', details: 'قاعة + كيترينج + زهور + إضاءة' },
    ],
    reviews: [
      { name: 'مريم أحمد', stars: 5, text: 'ولا في الخيال! القاعة جميلة جداً والخدمة ممتازة' },
      { name: 'محمد علي', stars: 5, text: 'من أفضل القاعات في مصر، استحقت كل قرش' },
    ]
  },
  {
    id: 2, name: 'ستوديو ليلى فوتو', category: 'التصوير',
    location: 'المعادي، القاهرة', rating: 4.8, reviewCount: 189,
    emoji: '📸', color: '#F0F5FF', phone: '011-9876-5432', capacity: '—',
    description: 'تصوير فوتوغرافي احترافي مع فريق متميز وأحدث المعدات',
    packages: [
      { name: 'باقة صور', price: '٨,٠٠٠', details: '٦ ساعات + ٢٠٠ صورة' },
      { name: 'باقة فيديو', price: '١٢,٠٠٠', details: 'تصوير + مونتاج' },
      { name: 'باقة كاملة', price: '٢٠,٠٠٠', details: 'صور + فيديو + ألبوم فاخر' },
    ],
    reviews: [
      { name: 'سارة محمود', stars: 5, text: 'الصور طلعت تحفة، المصور محترف جداً' },
      { name: 'كريم حسن', stars: 4, text: 'خدمة ممتازة وأسعار مناسبة' },
    ]
  },
];

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.css']
})
export class VendorDetailComponent implements OnInit {
  vendor = signal<any>(null);
  activeTab = 'info';
  tabs = [
    { key: 'info', label: 'معلومات' },
    { key: 'packages', label: 'الباقات' },
    { key: 'reviews', label: 'التقييمات' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vendor.set(MOCK_VENDORS.find(v => v.id === id) ?? null);
  }
}