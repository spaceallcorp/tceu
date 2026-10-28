import { Component, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RouterLink } from '@angular/router';

export interface CookiePreferences {
  essenciais: boolean;
  analiticos: boolean;
  personalizacao: boolean;
  marketing: boolean;
  version?: string;
  updatedAt?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: string]: unknown;
  }
}

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  providers: [CookieService],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css'
})
export class CookiesComponent implements OnInit {
  public cookieService = inject(CookieService);
  private platformId = inject(PLATFORM_ID);

  private readonly CONSENT_COOKIE_NAME = 'cookie-consent';
  private readonly CONSENT_VERSION = '2.0';
  private readonly GA_MEASUREMENT_ID = 'G-K8T8EDVSTZ';

  mostrarBanner = signal(false);
  mostrarModalAjustes = signal(false);
  consentimentoSalvo = signal(false);
  cookieInput = new FormControl('');

  // Preferências do usuário alinhadas com a Política de Cookies
  prefs: CookiePreferences = {
    essenciais: true, // Sempre ativo
    analiticos: false,
    personalizacao: false,
    marketing: false
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedConsent = this.lerPreferenciasSalvas();
    if (savedConsent) {
      this.prefs = {
        essenciais: true,
        analiticos: !!savedConsent.analiticos,
        personalizacao: !!savedConsent.personalizacao,
        marketing: !!savedConsent.marketing,
        version: savedConsent.version || this.CONSENT_VERSION,
        updatedAt: savedConsent.updatedAt
      };
      this.consentimentoSalvo.set(true);
      this.mostrarBanner.set(false);
      this.aplicarConsentimento(this.prefs);
    } else {
      this.mostrarBanner.set(true);
      this.aplicarConsentimento(this.prefs);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.mostrarModalAjustes()) {
      this.fecharAjustes();
    }
  }

  @HostListener('window:open-cookie-settings')
  onOpenSettings(): void {
    this.abrirAjustes();
  }

  aceitarTudo(): void {
    this.prefs.essenciais = true;
    this.prefs.analiticos = true;
    this.prefs.personalizacao = true;
    this.prefs.marketing = true;
    this.salvarPreferencias();
  }

  rejeitarTudo(): void {
    this.prefs.essenciais = true;
    this.prefs.analiticos = false;
    this.prefs.personalizacao = false;
    this.prefs.marketing = false;
    this.salvarPreferencias();
  }

  abrirAjustes(): void {
    const savedConsent = this.lerPreferenciasSalvas();
    if (savedConsent) {
      this.prefs = {
        essenciais: true,
        analiticos: !!savedConsent.analiticos,
        personalizacao: !!savedConsent.personalizacao,
        marketing: !!savedConsent.marketing
      };
    }
    this.mostrarModalAjustes.set(true);
  }

  fecharAjustes(): void {
    this.mostrarModalAjustes.set(false);
  }

  salvarPreferencias(): void {
    this.prefs.essenciais = true;
    const payload: CookiePreferences = {
      essenciais: true,
      analiticos: !!this.prefs.analiticos,
      personalizacao: !!this.prefs.personalizacao,
      marketing: !!this.prefs.marketing,
      version: this.CONSENT_VERSION,
      updatedAt: new Date().toISOString()
    };

    const consentStr = JSON.stringify(payload);
    const isSecure = isPlatformBrowser(this.platformId) && window.location.protocol === 'https:';

    this.cookieService.set(this.CONSENT_COOKIE_NAME, consentStr, {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
      secure: isSecure
    });

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.CONSENT_COOKIE_NAME, consentStr);
      } catch {
        // Ignore storage errors in private browsing
      }
    }

    this.aplicarConsentimento(payload);
    this.consentimentoSalvo.set(true);
    this.mostrarBanner.set(false);
    this.mostrarModalAjustes.set(false);
  }

  private lerPreferenciasSalvas(): CookiePreferences | null {
    try {
      if (this.cookieService.check(this.CONSENT_COOKIE_NAME)) {
        const raw = this.cookieService.get(this.CONSENT_COOKIE_NAME);
        if (raw) {
          return JSON.parse(raw) as CookiePreferences;
        }
      }
      if (isPlatformBrowser(this.platformId)) {
        const localRaw = localStorage.getItem(this.CONSENT_COOKIE_NAME);
        if (localRaw) {
          return JSON.parse(localRaw) as CookiePreferences;
        }
      }
    } catch {
      // Caso o JSON salvo esteja corrompido, solicita novo consentimento
    }
    return null;
  }

  private aplicarConsentimento(prefs: CookiePreferences): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 1. Ativa/desativa coleta do Google Analytics na janela
    window[`ga-disable-${this.GA_MEASUREMENT_ID}`] = !prefs.analiticos;

    // 2. Atualiza Google Consent Mode v2
    const gtagFn = window.gtag || ((...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    });

    gtagFn('consent', 'update', {
      analytics_storage: prefs.analiticos ? 'granted' : 'denied',
      ad_storage: prefs.marketing ? 'granted' : 'denied',
      ad_user_data: prefs.marketing ? 'granted' : 'denied',
      ad_personalization: prefs.marketing ? 'granted' : 'denied',
      functionality_storage: prefs.personalizacao ? 'granted' : 'denied',
      personalization_storage: prefs.personalizacao ? 'granted' : 'denied',
      security_storage: 'granted'
    });

    // 3. Remove cookies não autorizados caso o usuário tenha rejeitado ou revogado
    if (!prefs.analiticos) {
      this.limparCookiesPorPadrao([/^_ga/, /^_gid$/, /^_gat/, /^AMP_TOKEN$/]);
    }

    if (!prefs.marketing) {
      this.limparCookiesPorPadrao([/^_gcl_/, /^_fbp$/, /^_fbc$/, /^IDE$/, /^test_cookie$/]);
    }

    // 4. Emite eventos globais para que outros serviços/componentes da aplicação possam reagir
    window.dispatchEvent(
      new CustomEvent<CookiePreferences>('cookieConsentUpdated', { detail: prefs })
    );
    window.dispatchEvent(
      new CustomEvent<CookiePreferences>('cookie-consent-updated', { detail: prefs })
    );
  }

  private limparCookiesPorPadrao(patterns: RegExp[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const allCookies = this.cookieService.getAll();
    const hostname = window.location.hostname;
    const domainParts = hostname.split('.');
    const rootDomain = domainParts.length >= 2
      ? `.${domainParts.slice(-2).join('.')}`
      : hostname;

    for (const cookieName of Object.keys(allCookies)) {
      if (patterns.some(regex => regex.test(cookieName))) {
        this.cookieService.delete(cookieName, '/');
        this.cookieService.delete(cookieName, '/', hostname);
        this.cookieService.delete(cookieName, '/', `.${hostname}`);
        this.cookieService.delete(cookieName, '/', rootDomain);
      }
    }
  }

  setCookie(): void {
    const isSecure = isPlatformBrowser(this.platformId) && window.location.protocol === 'https:';
    this.cookieService.set('X-Auth-Token', this.cookieInput.value || '', {
      expires: 7,
      path: '/',
      sameSite: 'Strict',
      secure: isSecure
    });
  }

  deleteCookie(): void {
    this.cookieService.delete('X-Auth-Token', '/');
  }
}