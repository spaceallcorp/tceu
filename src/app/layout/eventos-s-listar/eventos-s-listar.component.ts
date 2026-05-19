import { Component, inject, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-eventos-s-listar',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './eventos-s-listar.component.html',
  styleUrl: './eventos-s-listar.component.css'
})
export class EventosSListarComponent implements OnInit {
  plainContent: string = '';
  private eventoService = inject(EventoService);
  eventos$ = this.eventoService.getEventosDestaque();

  constructor(
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) { }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  ngOnInit() {
    this.eventos$.subscribe(eventos => {
      if (eventos.length > 0) {
        // Remove all HTML tags from content
        this.plainContent = eventos[0].content.replace(/<[^>]*>/g, '');
      }
    });
  }

  async onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await this.eventoService.deleteEvento(id);
        console.log('✅ Evento deletado com sucesso');
      } catch (err) {
        console.error('❌ Erro ao deletar evento:', err);
      }
    }
  }
}