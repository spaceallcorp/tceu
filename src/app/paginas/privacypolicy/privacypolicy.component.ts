import { Component, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { MenuComponent } from '../../layout/menu/menu.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CookiePreferences } from '../../layout/cookies/cookies.component';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [CommonModule, RouterLink, RodapeComponent, TranslatePipe, MenuComponent],
  providers: [CookieService],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent implements OnInit {
  private translate = inject(TranslateService);
  private cookieService = inject(CookieService);
  private platformId = inject(PLATFORM_ID);

  consentStatus = signal<CookiePreferences | null>(null);
  activeSection = signal<number>(1);

  readonly sections = [
    { num: 1, key: 'privacy.policies.purpose.title' },
    { num: 2, key: 'privacy.policies.scope.title' },
    { num: 3, key: 'privacy.policies.personalData.title' },
    { num: 4, key: 'privacy.policies.otherInfo.title' },
    { num: 5, key: 'privacy.policies.dataUse.title' },
    { num: 6, key: 'privacy.policies.analytics.title' },
    { num: 7, key: 'privacy.policies.consent.title' },
    { num: 8, key: 'privacy.policies.retention.title' },
    { num: 9, key: 'privacy.policies.sharing.title' },
    { num: 10, key: 'privacy.policies.cookies.title' },
    { num: 11, key: 'privacy.policies.changes.title' },
    { num: 12, key: 'privacy.policies.disclaimer.title' },
    { num: 13, key: 'privacy.policies.dpo.title' }
  ];

  languages = [
    { code: 'pt', name: 'PT', flag: 'assets/flags/pt-flag.svg' },
    { code: 'en', name: 'EN', flag: 'assets/flags/us-flag.svg' },
    { code: 'fr', name: 'FR', flag: 'assets/flags/fr-flag.svg' },
    { code: 'es', name: 'ES', flag: 'assets/flags/es-flag.svg' }
  ];

  selectedLanguage = this.languages[0];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.syncCookieStatus();
    }
  }

  @HostListener('window:cookie-consent-updated', ['$event'])
  @HostListener('window:cookieConsentUpdated', ['$event'])
  onConsentUpdated(event: Event): void {
    const customEvent = event as CustomEvent<CookiePreferences>;
    if (customEvent.detail) {
      this.consentStatus.set(customEvent.detail);
    } else {
      this.syncCookieStatus();
    }
  }

  scrollToSection(sectionNum: number, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.activeSection.set(sectionNum);
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(`privacy-sec-${sectionNum}`);
      if (el) {
        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  private syncCookieStatus(): void {
    try {
      if (this.cookieService.check('cookie-consent')) {
        const raw = this.cookieService.get('cookie-consent');
        if (raw) {
          this.consentStatus.set(JSON.parse(raw) as CookiePreferences);
          return;
        }
      }
      if (isPlatformBrowser(this.platformId)) {
        const localRaw = localStorage.getItem('cookie-consent');
        if (localRaw) {
          this.consentStatus.set(JSON.parse(localRaw) as CookiePreferences);
        }
      }
    } catch {
      this.consentStatus.set(null);
    }
  }

  openCookieSettings(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const langCode = select.value;
    const foundLang = this.languages.find(l => l.code === langCode);
    if (foundLang) {
      this.selectedLanguage = foundLang;
    }
  }
}
