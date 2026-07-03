import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { QrApiService, QrCode, QrPurpose } from '../../core/qr-api.service';

@Component({ selector: 'app-qr-create', standalone: true, imports: [ReactiveFormsModule, NgIf], template: `
<section class="card page-heading"><h1>Create a QR code</h1><p>Fill out the form below. Payment QR codes require amount and currency.</p></section>
<section class="workspace"><form class="card form" [formGroup]="form" (ngSubmit)="submit()">
<label>Purpose<select formControlName="purpose"><option value="registration">Registration</option><option value="payment">Payment</option><option value="event">Event</option><option value="custom">Custom</option></select></label>
<label>Title<input formControlName="title" placeholder="Spring registration" /></label>
<label>Description<textarea formControlName="description" rows="4" placeholder="Optional instructions"></textarea></label>
<label>Destination URL<input formControlName="targetUrl" placeholder="https://example.com/register" /></label>
<div class="two-col"><label>Amount<input type="number" min="0" step="0.01" formControlName="amount" /></label><label>Currency<input maxlength="3" formControlName="currency" placeholder="USD" /></label></div>
<button class="button" [disabled]="form.invalid || loading()">{{ loading() ? 'Generating...' : 'Generate QR Code' }}</button><p class="error" *ngIf="error()">{{ error() }}</p></form>
<aside class="card preview"><h2>Generated QR</h2><ng-container *ngIf="created(); else empty"><img [src]="created()!.qrDataUrl" [alt]="created()!.title + ' QR code'"><h3>{{ created()!.title }}</h3><a [href]="created()!.qrDataUrl" download="qr-code.png">Download PNG</a></ng-container><ng-template #empty><p>Your QR code preview will appear here.</p></ng-template></aside></section>` })
export class QrCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(QrApiService);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly created = signal<QrCode | null>(null);
  readonly form = this.fb.group({ purpose: this.fb.nonNullable.control<QrPurpose>('registration'), title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]), description: this.fb.nonNullable.control(''), targetUrl: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]), amount: this.fb.control<number | null>(null), currency: this.fb.nonNullable.control('USD') });
  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set('');
    const value = this.form.getRawValue();
    this.api.create({ ...value, amount: value.amount ?? undefined, currency: value.amount ? value.currency.toUpperCase() : undefined }).subscribe({ next: (qr) => { this.created.set(qr); this.loading.set(false); }, error: () => { this.error.set('Unable to generate QR code. Please verify the form and API connection.'); this.loading.set(false); } });
  }
}
