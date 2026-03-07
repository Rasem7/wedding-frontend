import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

const MOCK_VENDORS = [
  { id:1, name:'بالاس ويدينج هول', category:'قاعات الأفراح', location:'مدينة نصر، القاهرة', rating:4.9, reviewCount:234, priceFrom:'من ٣٠,٠٠٠ جنيه', emoji:'🏛️', badge:'مميز', color:'#FFF5E6' },
  { id:2, name:'ستوديو ليلى فوتو', category:'التصوير', location:'المعادي، القاهرة', rating:4.8, reviewCount:189, priceFrom:'من ٨,٠٠٠ جنيه', emoji:'📸', badge:'', color:'#F0F5FF' },
  { id:3, name:'فلاورز باي نور', category:'تنسيق الزهور', location:'الزمالك، القاهرة', rating:4.7, reviewCount:156, priceFrom:'من ٥,٠٠٠ جنيه', emoji:'🌸', badge:'جديد', color:'#FFF0F5' },
  { id:4, name:'لافوشيه كيترينج', category:'كيترينج', location:'التجمع الخامس', rating:4.6, reviewCount:312, priceFrom:'من ١٢٠ جنيه/شخص', emoji:'🍽️', badge:'', color:'#F5F5F0' },
  { id:5, name:'جلوري برايدال', category:'فساتين الزفاف', location:'المهندسين، القاهرة', rating:4.9, reviewCount:421, priceFrom:'من ٥,٠٠٠ جنيه', emoji:'👗', badge:'الأكثر طلباً', color:'#F8F0FF' },
  { id:6, name:'موسيقار بند', category:'الموسيقى', location:'وسط البلد، القاهرة', rating:4.7, reviewCount:98, priceFrom:'من ٨,٠٠٠ جنيه', emoji:'🎵', badge:'', color:'#F0FFF5' },
];

const CATEGORIES = ['الكل', 'قاعات الأفراح', 'التصوير', 'تنسيق الزهور', 'كيترينج', 'فساتين الزفاف', 'الموسيقى'];

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="vendors-section">
      <div class="section-header">
        <div class="section-tag">مقدمو الخدمات</div>
        <h2 class="section-title">اختار <em>الأفضل</em> لفرحك</h2>
      </div>

      <div class="search-bar">
        <span>🔍</span>
        <input [(ngModel)]="searchQuery" (ngModelChange)="filter()" placeholder="ابحث عن مزود خدمة...">
      </div>

      <div class="filters">
        @for (cat of categories; track cat) {
          <button class="filter-btn" [class.active]="activeCategory === cat" (click)="setCategory(cat)">
            {{ cat }}
          </button>
        }
      </div>

      <div class="vendors-grid">
        @for (v of filtered(); track v.id) {
          <div class="vendor-card" [routerLink]="['/vendors', v.id]">
            <div class="vendor-img" [style.background]="v.color">
              <span>{{ v.emoji }}</span>
              @if (v.badge) { <span class="vendor-badge">{{ v.badge }}</span> }
            </div>
            <div class="vendor-body">
              <div class="vendor-cat">{{ v.category }}</div>
              <div class="vendor-name">{{ v.name }}</div>
              <div class="vendor-location">📍 {{ v.location }}</div>
              <div class="vendor-rating">
                <span class="stars">★★★★★</span>
                <strong>{{ v.rating }}</strong>
                <span class="review-count">({{ v.reviewCount }} تقييم)</span>
              </div>
              <div class="vendor-price">
                <span class="price-label">يبدأ من</span>
                <span class="price-value">{{ v.priceFrom }}</span>
              </div>
              <div class="vendor-actions">
                <button class="btn-book" (click)="$event.stopPropagation()" routerLink="/booking">احجز</button>
                <button class="btn-detail">التفاصيل</button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .vendors-section { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 2rem; }
    .section-tag {
      display: inline-block; background: rgba(201,168,76,0.12);
      border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
      padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;
    }
    .section-title { font-family: 'Amiri', serif; font-size: 2.2rem; color: #1A1208; }
    .section-title em { color: #C9A84C; font-style: italic; }

    .search-bar {
      display: flex; align-items: center; gap: 0.7rem;
      max-width: 500px; margin: 0 auto 1.5rem;
      background: #FFFDF8; border: 1.5px solid rgba(201,168,76,0.25);
      border-radius: 12px; padding: 0.75rem 1.2rem;
    }
    .search-bar input {
      border: none; background: none; outline: none; flex: 1;
      font-family: 'Tajawal', sans-serif; font-size: 0.95rem; color: #3D2B10;
    }
    .filters { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 2rem; }
    .filter-btn {
      padding: 0.5rem 1.2rem; border-radius: 50px;
      border: 1.5px solid rgba(201,168,76,0.3); background: transparent;
      color: #7A6040; font-family: 'Tajawal', sans-serif; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
    }
    .filter-btn.active, .filter-btn:hover { background: #C9A84C; color: white; border-color: #C9A84C; }

    .vendors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.5rem; }
    .vendor-card {
      background: #FFFDF8; border: 1px solid rgba(201,168,76,0.12);
      border-radius: 18px; overflow: hidden; cursor: pointer; transition: all 0.3s;
    }
    .vendor-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(26,18,8,0.12); }
    .vendor-img {
      height: 180px; display: flex; align-items: center;
      justify-content: center; font-size: 4rem; position: relative;
    }
    .vendor-badge {
      position: absolute; top: 1rem; right: 1rem;
      background: #C9A84C; color: white; padding: 0.2rem 0.6rem;
      border-radius: 50px; font-size: 0.7rem; font-weight: 700;
    }
    .vendor-body { padding: 1.3rem; }
    .vendor-cat { font-size: 0.75rem; font-weight: 600; color: #C5737A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
    .vendor-name { font-size: 1.1rem; font-weight: 700; color: #1A1208; margin-bottom: 0.3rem; }
    .vendor-location { font-size: 0.85rem; color: #7A6040; margin-bottom: 0.8rem; }
    .vendor-rating { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; }
    .stars { color: #C9A84C; }
    .review-count { color: #7A6040; font-size: 0.8rem; }
    .vendor-price { margin-top: 0.8rem; display: flex; align-items: center; justify-content: space-between; }
    .price-label { font-size: 0.8rem; color: #7A6040; }
    .price-value { font-size: 1rem; font-weight: 700; color: #8B6914; }
    .vendor-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn-book {
      flex: 1; padding: 0.55rem; border-radius: 8px;
      background: #C9A84C; color: white; border: none;
      font-family: 'Tajawal', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer;
    }
    .btn-book:hover { background: #8B6914; }
    .btn-detail {
      flex: 1; padding: 0.55rem; border-radius: 8px;
      background: transparent; color: #8B6914;
      border: 1.5px solid #C9A84C; font-family: 'Tajawal', sans-serif;
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
    }
    .btn-detail:hover { background: rgba(201,168,76,0.1); }
  `]
})
export class VendorsListComponent implements OnInit {
  categories = CATEGORIES;
  activeCategory = 'الكل';
  searchQuery = '';
  filtered = signal(MOCK_VENDORS);

  ngOnInit() { this.filter(); }

  setCategory(cat: string) { this.activeCategory = cat; this.filter(); }

  filter() {
    this.filtered.set(MOCK_VENDORS.filter(v => {
      const matchCat = this.activeCategory === 'الكل' || v.category === this.activeCategory;
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || v.name.includes(q) || v.location.includes(q) || v.category.includes(q);
      return matchCat && matchQ;
    }));
  }
}
