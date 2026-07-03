import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink], template: `
<header class="topbar"><a routerLink="/" class="brand">QR Code Studio</a><nav><a routerLink="/create">Create QR Code</a></nav></header>
<main><router-outlet /></main>
<footer>Built for registration, payment, event, and custom workflows.</footer>` })
export class AppComponent {}
