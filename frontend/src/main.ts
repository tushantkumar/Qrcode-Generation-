import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/features/home/home.component';
import { QrCreateComponent } from './app/features/qr-create/qr-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: QrCreateComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient()] }).catch((err) => console.error(err));
