import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink ],
  providers: [CookieService],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css'
})
export class CookiesComponent implements OnInit {
  public cookieService = inject(CookieService);
  
  mostrarBanner = signal(false);
  mostrarModalAjustes = signal(false);
  cookieInput = new FormControl('');

  // Preferências do usuário
  prefs = {
    essenciais: true, // Sempre verdadeiro
    marketing: false,
    analiticos: false
  };

  ngOnInit() {
    if (!this.cookieService.check('cookie-consent')) {
      this.mostrarBanner.set(true);
    }
  }

  aceitarTudo() {
    this.prefs.marketing = true;
    this.prefs.analiticos = true;
    this.salvarPreferencias();
  }

  rejeitarTudo() {
    this.prefs.marketing = false;
    this.prefs.analiticos = false;
    this.salvarPreferencias();
  }

  abrirAjustes() {
    this.mostrarModalAjustes.set(true);
  }

  fecharAjustes() {
    this.mostrarModalAjustes.set(false);
  }

  salvarPreferencias() {
    const consentObj = JSON.stringify(this.prefs);
    this.cookieService.set('cookie-consent', consentObj, 365, '/');
    this.mostrarBanner.set(false);
    this.mostrarModalAjustes.set(false);
  }

  // Métodos do seu Demo original
  setCookie() {
    this.cookieService.set('X-Auth-Token', this.cookieInput.value || '', 7, '/');
  }
  deleteCookie() {
    this.cookieService.delete('X-Auth-Token', '/');
  }
}