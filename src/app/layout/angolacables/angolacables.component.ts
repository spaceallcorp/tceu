import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for form binding
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ContadorComponent } from '../contador/contador.component';
import { CaracteristicasComponent } from '../caracteristicas/caracteristicas.component';
import { ParceirosComponent } from '../parceiros/parceiros.component';
import { EventosAcComponent } from '../../paginas/eventos-ac/eventos-ac.component';
import { EventosListarComponent } from '../eventos-listar/eventos-listar.component';
import { Ad2Component } from '../ad2/ad2.component';
import { ArtigoListaComponent } from '../artigo-lista/artigo-lista.component';
import { EventosComponent } from '../eventos/eventos.component';
import { BlogComponent } from '../blog/blog.component';
import { SlideshowComponent } from '../slideshow/slideshow.component';
import { NoticiasListarComponent } from '../noticias-listar/noticias-listar.component';
import { CertificacoesComponent } from '../certificacoes/certificacoes.component';
import { NgMagnizoomModule } from 'ng-magnizoom';
import emailjs from '@emailjs/browser';
import { QuoteOrderComponent } from '../quote-order/quote-order.component';

declare const UIkit: any; // Access UIkit globally


@Component({
  selector: 'app-angolacables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Added FormsModule here
    CertificacoesComponent,
    SlideshowComponent,
    NgMagnizoomModule,
    Ad2Component,
    EventosListarComponent,
    ParceirosComponent,
    TranslatePipe,
    RouterLink,
    NoticiasListarComponent,
    QuoteOrderComponent
],
  templateUrl: './angolacables.component.html',
  styleUrl: './angolacables.component.css',
})
export class AngolacablesComponent implements AfterViewInit {
  selectedImage: string | null = null;
  selectedImageDesc: string | null = null;


  
  constructor(private translate: TranslateService) {}

 
  onSelectImage(image: string, desc?: string) {
    this.selectedImage = image;
    this.selectedImageDesc = desc || null;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

 
  ngAfterViewInit(): void {
    const modal = UIkit.modal('#modal-video');
    const video: HTMLVideoElement | null = document.getElementById('promoVideo') as HTMLVideoElement;

    if (modal && video) {
      document.getElementById('modal-video')?.addEventListener('hidden', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  }
}