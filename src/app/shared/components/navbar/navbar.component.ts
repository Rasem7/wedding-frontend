import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav>
      <div class="nav-logo" routerLink="/">
        <span>💍</span>
        <span>عاوز اتجوز</span>
      </div>

      <ul class="nav-links">
        <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">الرئيسية</a></li>
        <li><a routerLink="/vendors" routerLinkActive="active">مزودو الخدمة</a></li>
        <li><a routerLink="/booking" routerLinkActive="active">حجز</a></li>

        @if (auth.isLoggedIn()) {
          <li><a routerLink="/calendar"      routerLinkActive="active">التقويم</a></li>
          <li><a routerLink="/clients"       routerLinkActive="active">العملاء</a></li>
          <li><a routerLink="/dashboard"     routerLinkActive="active">لوحة التحكم</a></li>
          <li><a routerLink="/vendors-admin" routerLinkActive="active">إدارة الخدمات</a></li>
        }
      </ul>

      <div class="nav-actions">
        @if (auth.isLoggedIn()) {
          <span class="user-name">{{ auth.currentUser()?.username }}</span>
          <button class="nav-btn-outline" (click)="auth.logout()">خروج</button>
        } @else {
          <button class="nav-btn" routerLink="/booking">+ حجز جديد</button>
          <button class="nav-btn-outline" routerLink="/login">دخول الإدارة</button>
        }
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(250,245,238,0.97);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(201,168,76,0.2);
      padding: 0 2rem;
      height: 70px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 30px rgba(26,18,8,0.1);
    }
    .nav-logo {
      font-family: 'Amiri', serif;
      font-size: 1.4rem; font-weight: 700;
      color: var(--gold-dark); cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .nav-links {
      display: flex; gap: 0.2rem; list-style: none;
    }
    .nav-links a {
      text-decoration: none; color: var(--text-light);
      font-size: 0.9rem; padding: 0.5rem 0.9rem;
      border-radius: 8px; transition: all 0.2s; font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
      background: var(--gold); color: var(--white);
    }
    .nav-actions { display: flex; gap: 0.5rem; align-items: center; }
    .user-name { font-size: 0.85rem; color: var(--text-light); }
    .nav-btn {
      background: var(--gold); color: var(--white);
      border: none; border-radius: 10px;
      padding: 0.55rem 1.2rem;
      font-family: 'Tajawal', sans-serif;
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--gold-dark); }
    .nav-btn-outline {
      background: transparent; color: var(--gold-dark);
      border: 1.5px solid var(--gold); border-radius: 10px;
      padding: 0.5rem 1.1rem;
      font-family: 'Tajawal', sans-serif;
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .nav-btn-outline:hover { background: var(--gold); color: var(--white); }

    @media (max-width: 768px) {
      .nav-links { display: none; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
}