import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rodape',
  imports: [  CommonModule, RouterLink],
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.css'
})
export class RodapeComponent {

  year: number = new Date().getFullYear();

      useLanguage(language: string): void {
          this.translate.use(language);
      }
      
      constructor(private translate: TranslateService) {}
      

}
