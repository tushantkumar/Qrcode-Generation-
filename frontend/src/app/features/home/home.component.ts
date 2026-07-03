import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { QrApiService, QrCode } from '../../core/qr-api.service';

@Component({ selector: 'app-home', standalone: true, imports: [RouterLink, NgFor, DatePipe], template: `
<section class="hero card"><p class="eyebrow">Secure QR workflows</p><h1>Create production-ready QR codes in seconds.</h1><p>Generate trackable QR codes for registration, payments, events, and custom landing pages with a Node.js API and PostgreSQL storage.</p><a class="button" routerLink="/create">Create QR Code</a></section>
<section class="card"><h2>Recent QR codes</h2><div class="grid"><article *ngFor="let qr of qrCodes()" class="qr-card"><img [src]="qr.qrDataUrl" [alt]="qr.title + ' QR code'"><div><strong>{{ qr.title }}</strong><span>{{ qr.purpose }} · {{ qr.createdAt | date:'medium' }}</span></div></article></div></section>` })
export class HomeComponent implements OnInit {
  private readonly api = inject(QrApiService);
  readonly qrCodes = signal<QrCode[]>([]);
  ngOnInit(): void { this.api.list().subscribe({ next: (items) => this.qrCodes.set(items), error: () => this.qrCodes.set([]) }); }
}
