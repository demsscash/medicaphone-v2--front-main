import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './authentication/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'medicaphone';


  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('fr');
    this.translate.use(this.translate.getBrowserLang() || 'fr');
    this.redirectIfAuthenticated();
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  private redirectIfAuthenticated() {
    if (this.authService.isAuthenticated()) {
      const lastPage = localStorage.getItem('lastVisitedPage') || '';
      this.router.navigate([lastPage]);
    }
  }
}
