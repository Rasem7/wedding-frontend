import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <span class="login-emoji">💍</span>
          <h1>دخول الإدارة</h1>
          <p>سجل دخولك للوصول للوحة التحكم</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>اسم المستخدم</label>
            <input type="text" formControlName="email" placeholder="admin">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error">اسم المستخدم مطلوب</span>
            }
          </div>

          <div class="form-group">
            <label>كلمة المرور</label>
            <input [type]="showPass ? 'text' : 'password'"
                   formControlName="password" placeholder="••••••••">
            <button type="button" class="toggle-pass" (click)="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <span class="error">كلمة المرور مطلوبة</span>
            }
          </div>

          <div class="remember-row">
            <label class="remember-label">
              <input type="checkbox" formControlName="rememberMe">
              <span>تذكرني لمدة ٣٠ يوم</span>
            </label>
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            @if (loading) { <span>جاري الدخول...</span> }
            @else { <span>دخول ←</span> }
          </button>
        </form>

        <div class="hint-box">
          <span>🔑</span>
          <span>اسم المستخدم: <strong>admin</strong> — كلمة المرور: <strong>Admin@123</strong></span>
        </div>

        <p class="back-link">
          <a routerLink="/">← العودة للرئيسية</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; display: flex;
      align-items: center; justify-content: center;
      background: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08), transparent 60%),
                  var(--cream);
      padding: 2rem;
    }
    .login-card {
      background: var(--white);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 24px; padding: 2.5rem;
      width: 100%; max-width: 420px;
      box-shadow: 0 20px 60px rgba(26,18,8,0.12);
    }
    .login-header { text-align: center; margin-bottom: 2rem; }
    .login-emoji { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .login-header h1 {
      font-family: 'Amiri', serif; font-size: 1.8rem;
      color: var(--dark); margin-bottom: 0.3rem;
    }
    .login-header p { color: var(--text-light); font-size: 0.9rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.4rem;
      margin-bottom: 1.2rem; position: relative;
    }
    label { font-size: 0.85rem; font-weight: 600; color: var(--text); }
    input[type="text"], input[type="password"] {
      padding: 0.8rem 1rem;
      border: 1.5px solid rgba(201,168,76,0.25);
      border-radius: 10px; background: var(--cream);
      font-family: 'Tajawal', sans-serif; font-size: 0.95rem;
      color: var(--text); outline: none; transition: border-color 0.2s;
      width: 100%;
    }
    input:focus { border-color: var(--gold); background: var(--white); }
    .toggle-pass {
      position: absolute; left: 0.8rem; bottom: 0.6rem;
      background: none; border: none; cursor: pointer; font-size: 1rem;
    }
    .error { font-size: 0.8rem; color: #C5373A; }
    .remember-row { margin-bottom: 1.2rem; }
    .remember-label {
      display: flex; align-items: center; gap: 0.5rem;
      font-size: 0.85rem; color: var(--text-light); cursor: pointer; font-weight: 400;
    }
    .remember-label input { width: auto; accent-color: var(--gold); }
    .btn-login {
      width: 100%; padding: 0.9rem;
      background: var(--gold); color: var(--white);
      border: none; border-radius: 12px;
      font-family: 'Tajawal', sans-serif;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      transition: all 0.2s; margin-top: 0.5rem;
    }
    .btn-login:hover:not(:disabled) { background: var(--dark); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
    .hint-box {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);
      border-radius: 10px; padding: 0.75rem 1rem;
      font-size: 0.82rem; color: var(--text-light); margin-top: 1rem;
    }
    .back-link { text-align: center; margin-top: 1rem; }
    .back-link a { color: var(--gold-dark); font-size: 0.9rem; text-decoration: none; }
  `]
})
export class LoginComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading  = false;
  showPass = false;

  form = this.fb.group({
    email:   ['', Validators.required],
    password:   ['', Validators.required],
    rememberMe: [false],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    this.auth.login({
      email: this.form.value.email!,
      password: this.form.value.password!,
      rememberMe: this.form.value.rememberMe ?? false,
    }).subscribe({
      next: () => {
        this.toast.success('أهلاً! تم تسجيل الدخول بنجاح');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err)
        this.toast.error(err.status === 401 ? 'بيانات خاطئة، حاول تاني' : 'حصل خطأ، حاول بعدين');
        this.loading = false;
      }
    });
  }
}