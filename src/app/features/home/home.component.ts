import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BudgetPlannerComponent } from '../budget/budget-planner.component';

const SERVICES = [
  { icon: '🏛️', name: 'قاعات الأفراح', desc: 'أجمل القاعات والفيلات لاستيعاب ضيوفك', count: '٤٨ قاعة' },
  { icon: '📸', name: 'التصوير والفيديو', desc: 'مصورون محترفون لتوثيق كل لحظة', count: '٣٢ مصور' },
  { icon: '🌸', name: 'تنسيق الزهور', desc: 'بوكيهات وزينة زهور تناسب ذوقك', count: '٢٥ محل' },
  { icon: '🍽️', name: 'الكيترينج', desc: 'قوائم طعام متنوعة لجميع الأذواق', count: '٣٨ مطبخ' },
  { icon: '💄', name: 'كوافير ومكياج', desc: 'متخصصون في إطلالات العرايس', count: '٥٤ كوافير' },
  { icon: '🎵', name: 'الموسيقى والفرق', desc: 'فرق موسيقية لإحياء أمسيتك', count: '١٩ فرقة' },
  { icon: '👗', name: 'فساتين الزفاف', desc: 'أحدث تصميمات لكل عروسة', count: '٣١ محل' },
  { icon: '🎂', name: 'الحلويات والتورتات', desc: 'تورتات تحفة فنية على مقاسك', count: '٢٢ حلواني' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BudgetPlannerComponent],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-ornament"></div>
      <div class="hero-ornament"></div>

      <div class="hero-badge">✨ منصة حفلات الزفاف الأولى في مصر</div>
      <h1>كل تفصيلة في<em>حفل أحلامك</em></h1>
      <p class="hero-sub">من القاعة إلى الكوافير — نوفرلك كل اللي تحتاجه لفرحك في مكان واحد</p>

      <div class="hero-actions">
        <button class="btn-primary" routerLink="/vendors">تصفح مقدمو الخدمات</button>
        <button class="btn-outline" routerLink="/booking">احجز دلوقتي</button>
        <app-budget-planner></app-budget-planner>
      </div>

      <div class="hero-stats">
        <div class="stat-item"><span class="stat-num">٢٤٠+</span><span class="stat-label">مزود خدمة</span></div>
        <div class="stat-item"><span class="stat-num">١٨٠٠+</span><span class="stat-label">حفل ناجح</span></div>
        <div class="stat-item"><span class="stat-num">٩٨٪</span><span class="stat-label">رضا العملاء</span></div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services-section">
      <div class="section-header">
        <div class="section-tag">خدماتنا</div>
        <h2 class="section-title">كل اللي فرحك <em>محتاجه</em></h2>
        <p class="section-sub">اختار من بين تشكيلة واسعة من الخدمات المتكاملة</p>
      </div>
      <div class="services-grid">
        @for (s of services; track s.name) {
          <div class="service-card" routerLink="/vendors">
            <div class="service-icon">{{ s.icon }}</div>
            <h3>{{ s.name }}</h3>
            <p>{{ s.desc }}</p>
            <span class="service-count">{{ s.count }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .hero {
      min-height: calc(100vh - 70px);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 3rem 2rem;
      position: relative; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08), transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(197,115,122,0.07), transparent 50%);
    }
    .hero-ornament {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(201,168,76,0.1);
      animation: spin 30s linear infinite;
    }
    .hero-ornament:nth-child(2) { width:500px; height:500px; }
    .hero-ornament:nth-child(3) { width:800px; height:800px; animation-duration:50s; animation-direction:reverse; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .hero-badge {
      position: relative;
      background: rgba(201,168,76,0.12);
      border: 1px solid rgba(201,168,76,0.3);
      color: #8B6914; padding: 0.4rem 1.2rem;
      border-radius: 50px; font-size: 0.85rem;
      font-weight: 500; margin-bottom: 1.5rem;
    }
    h1 {
      position: relative;
      font-family: 'Amiri', serif;
      font-size: clamp(3rem, 7vw, 5.5rem);
      color: #1A1208; line-height: 1.1;
      margin-bottom: 0.5rem;
    }
    h1 em { font-style: italic; color: #C9A84C; display: block; }
    .hero-sub {
      position: relative;
      font-size: 1.1rem; color: #7A6040;
      max-width: 500px; line-height: 1.7;
      margin-bottom: 2.5rem;
    }
    .hero-actions {
      position: relative;
      display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
      margin-bottom: 3rem;
    }
    .btn-primary {
      background: #C9A84C; color: white; border: none;
      border-radius: 12px; padding: 0.85rem 2rem;
      font-family: 'Tajawal', sans-serif; font-size: 1rem;
      font-weight: 600; cursor: pointer; transition: all 0.25s;
      box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    }
    .btn-primary:hover { background: #8B6914; transform: translateY(-2px); }
    .btn-outline {
      background: transparent; color: #8B6914;
      border: 2px solid #C9A84C; border-radius: 12px;
      padding: 0.85rem 2rem; font-family: 'Tajawal', sans-serif;
      font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.25s;
    }
    .btn-outline:hover { background: #C9A84C; color: white; }
    .hero-stats {
      position: relative;
      display: flex; gap: 3rem; flex-wrap: wrap; justify-content: center;
    }
    .stat-item { text-align: center; }
    .stat-num {
      font-family: 'Amiri', serif; font-size: 2rem;
      font-weight: 700; color: #8B6914; display: block;
    }
    .stat-label { font-size: 0.85rem; color: #7A6040; }

    /* SERVICES */
    .services-section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-tag {
      display: inline-block; background: rgba(201,168,76,0.12);
      border: 1px solid rgba(201,168,76,0.3); color: #8B6914;
      padding: 0.3rem 1rem; border-radius: 50px;
      font-size: 0.8rem; font-weight: 600; margin-bottom: 0.8rem;
    }
    .section-title { font-family: 'Amiri', serif; font-size: 2.5rem; color: #1A1208; }
    .section-title em { color: #C9A84C; font-style: italic; }
    .section-sub { color: #7A6040; font-size: 1rem; margin-top: 0.5rem; }
    .services-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;
    }
    .service-card {
      background: #FFFDF8; border: 1px solid rgba(201,168,76,0.15);
      border-radius: 20px; padding: 2rem; cursor: pointer;
      transition: all 0.3s; position: relative; overflow: hidden;
    }
    .service-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #C9A84C, #E8C87A);
      transform: scaleX(0); transform-origin: right; transition: transform 0.3s;
    }
    .service-card:hover { transform: translateY(-4px); box-shadow: 0 15px 40px rgba(26,18,8,0.12); }
    .service-card:hover::before { transform: scaleX(1); transform-origin: left; }
    .service-icon {
      width: 55px; height: 55px; background: rgba(201,168,76,0.12);
      border-radius: 14px; display: flex; align-items: center;
      justify-content: center; font-size: 1.6rem; margin-bottom: 1rem;
    }
    .service-card h3 { font-size: 1.1rem; font-weight: 700; color: #1A1208; margin-bottom: 0.5rem; }
    .service-card p { font-size: 0.9rem; color: #7A6040; line-height: 1.6; }
    .service-count {
      margin-top: 1rem; font-size: 0.8rem; font-weight: 600;
      color: #8B6914; background: rgba(201,168,76,0.1);
      display: inline-block; padding: 0.25rem 0.75rem; border-radius: 50px;
    }
  `]
})
export class HomeComponent {
  services = SERVICES;
}