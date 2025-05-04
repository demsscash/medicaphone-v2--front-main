
/// <reference types="@angular/localize" />
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/authentication/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

enableProdMode();

const mergedConfig = {
  providers: [
    ...appConfig.providers,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync()
  ]
};

bootstrapApplication(AppComponent, mergedConfig).catch(err => console.error(err));