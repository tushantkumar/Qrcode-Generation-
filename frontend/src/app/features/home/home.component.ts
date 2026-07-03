import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QrApiService, QrCode } from '../../core/qr-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe],
  template: `
<section class="home-hero">
  <div class="hero-copy">
    <p class="eyebrow">Local-first QR workflows</p>
    <h1>Design, generate, and share beautiful QR codes in seconds.</h1>
    <p class="hero-text">Create polished QR experiences for registrations, payments, events, and custom journeys with a local Node.js API and file storage—no Docker or database setup required.</p>
    <div class="hero-actions">
      <a class="button button-primary" routerLink="/create">Create QR Code</a>
      <a class="button button-secondary" href="#recent-codes">View recent codes</a>
    </div>
    <div class="hero-stats" aria-label="QR platform highlights">
      <span><strong>4</strong> workflows</span>
      <span><strong>PNG</strong> export</span>
      <span><strong>Local</strong> storage</span>
    </div>
  </div>
  <div class="hero-art" aria-hidden="true">
    <img src="assets/qr-hero.svg" alt="" />
    <span class="floating-badge badge-registration">Registration ready</span>
    <span class="floating-badge badge-payment">Payment links</span>
  </div>
</section>

<section class="feature-strip" aria-label="Platform features">
  <article class="feature-card" *ngFor="let feature of features">
    <span class="feature-icon">{{ feature.icon }}</span>
    <h2>{{ feature.title }}</h2>
    <p>{{ feature.description }}</p>
  </article>
</section>

<section class="recent-section card" id="recent-codes">
  <div class="section-heading">
    <p class="eyebrow">Library</p>
    <h2>Recent QR codes</h2>
    <p>Your latest 50 locally saved QR codes appear here automatically.</p>
  </div>
  <div class="grid recent-grid" *ngIf="qrCodes().length; else emptyState">
    <article *ngFor="let qr of qrCodes()" class="qr-card enhanced-qr-card">
      <img [src]="qr.qrDataUrl" [alt]="qr.title + ' QR code'">
      <div>
        <strong>{{ qr.title }}</strong>
        <span>{{ qr.purpose }} · {{ qr.createdAt | date:'medium' }}</span>
      </div>
    </article>
  </div>
  <ng-template #emptyState>
    <div class="empty-state">
      <div class="empty-illustration">▦</div>
      <h3>No QR codes yet</h3>
      <p>Create your first QR code and it will show up in this gallery.</p>
      <a class="button button-primary" routerLink="/create">Start generating</a>
    </div>
  </ng-template>
</section>`
})
export class HomeComponent implements OnInit {
  private readonly api = inject(QrApiService);
  readonly qrCodes = signal<QrCode[]>([]);
  readonly features = [
    { icon: '⚡', title: 'Instant creation', description: 'Generate QR PNGs quickly from a simple guided form.' },
    { icon: '🎨', title: 'Polished output', description: 'Clean, scan-friendly QR codes ready for campaigns and events.' },
    { icon: '💾', title: 'Runs locally', description: 'Records are stored in a local JSON file for easy development.' }
  ];

  ngOnInit(): void {
    this.api.list().subscribe({ next: (items) => this.qrCodes.set(items), error: () => this.qrCodes.set([]) });
  }
}
