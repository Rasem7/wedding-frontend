import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendorService, MediaService } from '../../../core/services/api.service';
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

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.css']
})
export class VendorDetailComponent implements OnInit {
  private route      = inject(ActivatedRoute);
  private vendorSvc  = inject(VendorService);
  private mediaSvc   = inject(MediaService);

  vendor     = signal<Vendor | null>(null);
  media      = signal<any[]>([]);
  loading    = signal(true);
  lightbox   = signal<any | null>(null);
  activeTab  = 'info';
  vendorId   = 0;

  tabs = [
    { key: 'info',    label: 'معلومات' },
    { key: 'media',   label: 'الصور والفيديوهات' },
    { key: 'contact', label: 'التواصل' },
  ];

  ngOnInit() {
    this.vendorId = Number(this.route.snapshot.paramMap.get('id'));
    this.vendorSvc.getById(this.vendorId).subscribe({
      next: v  => { this.vendor.set(v); this.loading.set(false); },
      error: () => { this.vendor.set(null); this.loading.set(false); }
    });
    this.loadMedia();
  }

  loadMedia() {
    this.mediaSvc.getMedia(this.vendorId).subscribe({
      next: m => this.media.set(m),
      error: () => this.media.set([])
    });
  }

  images()  { return this.media().filter(m => m.mediaType === 'image'); }
  videos()  { return this.media().filter(m => m.mediaType === 'video'); }

  openLightbox(item: any) { this.lightbox.set(item); }
  closeLightbox() { this.lightbox.set(null); }

  categoryIcon(cat: string) { return CATEGORY_ICONS[cat] ?? '🏪'; }
}