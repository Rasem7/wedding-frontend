// import { Component, OnInit, signal, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { VendorService } from '../../../core/services/api.service';
// import { Vendor } from '../../../core/models';

// const CATEGORY_ICONS: Record<string, string> = {
//   'قاعات الأفراح': '🏛️',
//   'التصوير والفيديو': '📸',
//   'تنسيق الزهور': '🌸',
//   'الكيترينج': '🍽️',
//   'كوافير ومكياج': '💄',
//   'الموسيقى': '🎵',
//   'فساتين الزفاف': '👗',
//   'الحلويات': '🎂',
// };

// const CATEGORY_COLORS: Record<string, string> = {
//   'قاعات الأفراح': '#FFF5E6',
//   'التصوير والفيديو': '#F0F5FF',
//   'تنسيق الزهور': '#FFF0F5',
//   'الكيترينج': '#F5F5F0',
//   'كوافير ومكياج': '#FFF0FF',
//   'الموسيقى': '#F0FFF5',
//   'فساتين الزفاف': '#F8F0FF',
//   'الحلويات': '#FFF8F0',
// };

// const CATEGORIES = ['الكل', 'قاعات الأفراح', 'التصوير والفيديو', 'تنسيق الزهور', 'الكيترينج', 'كوافير ومكياج', 'فساتين الزفاف', 'الموسيقى'];

// @Component({
//   selector: 'app-vendors-list',
//   standalone: true,
//   imports: [CommonModule, RouterLink, FormsModule],
//   template: `
//     <section class="vendors-section">
//       <div class="section-header">
//         <div class="section-tag">مزودو الخدمة</div>
//         <h2 class="section-title">اختار <em>الأفضل</em> لفرحك</h2>
//       </div>

//       <div class="search-bar">
//         <span>🔍</span>
//         <input [(ngModel)]="searchQuery" (ngModelChange)="filter()"
//                placeholder="ابحث عن مزود خدمة...">
//       </div>

//       <div class="filters">
//         @for (cat of categories; track cat) {
//           <button class="filter-btn" [class.active]="activeCategory === cat"
//                   (click)="setCategory(cat)">{{ cat }}</button>
//         }
//       </div>

//       @if (loading()) {
//         <div class="vendors-grid">
//           @for (i of [1,2,3,4,5,6]; track i) {
//             <div class="vendor-skeleton"></div>
//           }
//         </div>
//       } @else if (filtered().length === 0) {
//         <div class="empty">
//           <div class="empty-icon">🏪</div>
//           <p>لا يوجد مزودو خدمة في هذه الفئة</p>
//         </div>
//       } @else {
//         <div class="vendors-grid">
//           @for (v of filtered(); track v.id) {
//             <div class="vendor-card" [routerLink]="['/vendors', v.id]">
//               <div class="vendor-img" [style.background]="categoryColor(v.category)">
//                 <span>{{ categoryIcon(v.category) }}</span>
//                 @if (v.rating >= 4.8) {
//                   <span class="vendor-badge">مميز ⭐</span>
//                 }
//               </div>
//               <div class="vendor-body">
//                 <div class="vendor-cat">{{ v.category }}</div>
//                 <div class="vendor-name">{{ v.name }}</div>
//                 <div class="vendor-location">📍 {{ v.location }}</div>
//                 <div class="vendor-rating">
//                   <span class="stars">★★★★★</span>
//                   <strong>{{ v.rating }}</strong>
//                   <span class="review-count">({{ v.reviewCount }} تقييم)</span>
//                 </div>
//                 <div class="vendor-price">
//                   <span class="price-label">يبدأ من</span>
//                   <span class="price-value">{{ v.priceFrom | number }} ج</span>
//                 </div>
//                 <div class="vendor-actions">
//                   <button class="btn-book" (click)="$event.stopPropagation()"
//                           routerLink="/booking">احجز</button>
//                   <button class="btn-detail">التفاصيل</button>
//                 </div>
//               </div>
//             </div>
//           }
//         </div>
//       }
//     </section>
//   `,
//   styles: [`
//     .vendors-section { padding: 2rem; max-width: 1200px; margin: 0 auto; }
//     .section-header { text-align: center; margin-bottom: 2rem; }
//     .section-tag {
//       display: inline-block; background: rgba(201,168,76,0.12);
//       border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
//       padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;
//     }
//     .section-title { font-family: 'Amiri', serif; font-size: 2.2rem; color: #1A1208; }
//     .section-title em { color: #C9A84C; font-style: italic; }
//     .search-bar {
//       display: flex; align-items: center; gap: 0.7rem;
//       max-width: 500px; margin: 0 auto 1.5rem;
//       background: #FFFDF8; border: 1.5px solid rgba(201,168,76,0.25);
//       border-radius: 12px; padding: 0.75rem 1.2rem;
//     }
//     .search-bar input {
//       border: none; background: none; outline: none; flex: 1;
//       font-family: 'Tajawal', sans-serif; font-size: 0.95rem; color: #3D2B10;
//     }
//     .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem; }
//     .filter-btn {
//       padding: 0.5rem 1.2rem; border-radius: 50px;
//       border: 1.5px solid rgba(201,168,76,0.3); background: transparent;
//       color: #7A6040; font-family: 'Tajawal', sans-serif; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
//     }
//     .filter-btn.active, .filter-btn:hover { background: #C9A84C; color: white; border-color: #C9A84C; }
//     .vendors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.5rem; }
//     .vendor-skeleton {
//       height: 380px; border-radius: 18px;
//       background: linear-gradient(90deg, #f0e8d8 25%, #faf5ee 50%, #f0e8d8 75%);
//       background-size: 200% 100%; animation: shimmer 1.5s infinite;
//     }
//     @keyframes shimmer { to { background-position: -200% 0; } }
//     .empty { text-align: center; padding: 4rem; color: #7A6040; }
//     .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
//     .vendor-card {
//       background: #FFFDF8; border: 1px solid rgba(201,168,76,0.12);
//       border-radius: 18px; overflow: hidden; cursor: pointer; transition: all 0.3s;
//     }
//     .vendor-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(26,18,8,0.12); }
//     .vendor-img {
//       height: 180px; display: flex; align-items: center;
//       justify-content: center; font-size: 4rem; position: relative;
//     }
//     .vendor-badge {
//       position: absolute; top: 1rem; right: 1rem;
//       background: #C9A84C; color: white; padding: 0.2rem 0.6rem;
//       border-radius: 50px; font-size: 0.7rem; font-weight: 700;
//     }
//     .vendor-body { padding: 1.3rem; }
//     .vendor-cat { font-size: 0.75rem; font-weight: 600; color: #C5737A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
//     .vendor-name { font-size: 1.1rem; font-weight: 700; color: #1A1208; margin-bottom: 0.3rem; }
//     .vendor-location { font-size: 0.85rem; color: #7A6040; margin-bottom: 0.8rem; }
//     .vendor-rating { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; }
//     .stars { color: #C9A84C; }
//     .review-count { color: #7A6040; font-size: 0.8rem; }
//     .vendor-price { margin-top: 0.8rem; display: flex; align-items: center; justify-content: space-between; }
//     .price-label { font-size: 0.8rem; color: #7A6040; }
//     .price-value { font-size: 1rem; font-weight: 700; color: #8B6914; }
//     .vendor-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
//     .btn-book {
//       flex: 1; padding: 0.55rem; border-radius: 8px;
//       background: #C9A84C; color: white; border: none;
//       font-family: 'Tajawal', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer;
//     }
//     .btn-book:hover { background: #8B6914; }
//     .btn-detail {
//       flex: 1; padding: 0.55rem; border-radius: 8px;
//       background: transparent; color: #8B6914;
//       border: 1.5px solid #C9A84C; font-family: 'Tajawal', sans-serif;
//       font-size: 0.85rem; font-weight: 600; cursor: pointer;
//     }
//     .btn-detail:hover { background: rgba(201,168,76,0.1); }
//   `]
// })
// export class VendorsListComponent implements OnInit {
//   private vendorSvc = inject(VendorService);

//   allVendors    = signal<Vendor[]>([]);
//   filtered      = signal<Vendor[]>([]);
//   loading       = signal(true);
//   categories    = CATEGORIES;
//   activeCategory = 'الكل';
//   searchQuery   = '';

//   ngOnInit() { this.load(); }

//   load() {
//     this.loading.set(true);
//     this.vendorSvc.getAll().subscribe({
//       next: vendors => {
//         this.allVendors.set(vendors);
//         this.filter();
//         this.loading.set(false);
//       },
//       error: () => {
//         // لو الـ API مش شغال — عرض رسالة فارغة
//         this.loading.set(false);
//       }
//     });
//   }

//   setCategory(cat: string) { this.activeCategory = cat; this.filter(); }

//   filter() {
//     this.filtered.set(this.allVendors().filter(v => {
//       const matchCat = this.activeCategory === 'الكل' || v.category === this.activeCategory;
//       const q = this.searchQuery.toLowerCase();
//       const matchQ = !q || v.name.toLowerCase().includes(q) || v.location.toLowerCase().includes(q) || v.category.includes(q);
//       return matchCat && matchQ;
//     }));
//   }

//   categoryIcon(cat: string) { return CATEGORY_ICONS[cat] ?? '🏪'; }
//   categoryColor(cat: string) { return CATEGORY_COLORS[cat] ?? '#FAF5EE'; }
// }

// --------------------------------
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../../core/services/api.service';
import { Vendor } from '../../../core/models';

const CATEGORY_ICONS: Record<string, string> = {
  'قاعات الأفراح': '🏛️',
  'التصوير والفيديو': '📸',
  'تنسيق الزهور': '🌸',
  'الكيترينج': '🍽️',
  'كوافير ومكياج': '💄',
  'الموسيقى': '🎵',
  'فساتين الزفاف': '👗',
  'الحلويات': '🎂',
};

const CATEGORY_COLORS: Record<string, string> = {
  'قاعات الأفراح': '#FFF5E6',
  'التصوير والفيديو': '#F0F5FF',
  'تنسيق الزهور': '#FFF0F5',
  'الكيترينج': '#F5F5F0',
  'كوافير ومكياج': '#FFF0FF',
  'الموسيقى': '#F0FFF5',
  'فساتين الزفاف': '#F8F0FF',
  'الحلويات': '#FFF8F0',
};

const CATEGORIES = [
  'الكل',
  'قاعات الأفراح',
  'التصوير والفيديو',
  'تنسيق الزهور',
  'الكيترينج',
  'كوافير ومكياج',
  'فساتين الزفاف',
  'الموسيقى'
];

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.css']
})
export class VendorsListComponent implements OnInit {
  private vendorSvc = inject(VendorService);

  allVendors    = signal<Vendor[]>([]);
  filtered      = signal<Vendor[]>([]);
  loading       = signal(true);
  categories    = CATEGORIES;
  activeCategory = 'الكل';
  searchQuery   = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.vendorSvc.getAll().subscribe({
      next: vendors => {
        this.allVendors.set(vendors);
        this.filter();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.filter();
  }

  filter() {
    this.filtered.set(this.allVendors().filter(v => {
      const matchCat =
        this.activeCategory === 'الكل' ||
        v.category === this.activeCategory;

      const q = this.searchQuery.toLowerCase();

      const matchQ =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.category.includes(q);

      return matchCat && matchQ;
    }));
  }

  categoryIcon(cat: string) {
    return CATEGORY_ICONS[cat] ?? '🏪';
  }

  categoryColor(cat: string) {
    return CATEGORY_COLORS[cat] ?? '#FAF5EE';
  }
}