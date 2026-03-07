import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.type" (click)="toast.remove(t.id)">
          <span>{{ icon(t.type) }}</span>
          <span>{{ t.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      z-index: 9999; display: flex; flex-direction: column;
      gap: 0.5rem; align-items: center;
    }
    .toast {
      background: #1A1208; color: #fff;
      padding: 0.8rem 1.5rem; border-radius: 12px;
      font-size: 0.9rem; cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      display: flex; align-items: center; gap: 0.5rem;
      animation: slideUp 0.3s ease;
    }
    .toast.success { background: #1A5C35; }
    .toast.error   { background: #7A2030; }
    .toast.info    { background: #1A3A5C; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: none; }
    }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
  icon(type: string) {
    return type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  }
}
