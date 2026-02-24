import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { MenuComponent } from '../../layout/menu/menu.component';

@Component({
  selector: 'app-cookies-policy',
  imports: [ TranslatePipe, RodapeComponent, MenuComponent ],
  templateUrl: './cookies-policy.component.html',
  styleUrl: './cookies-policy.component.css'
})
export class CookiesPolicyComponent {

  cookiesUpdatedDate = "2025-01-15" ; // January is 0, so this represents January 15, 2025
  
        useLanguage(language: string): void {
              this.translate.use(language);
          }
          
          constructor(private translate: TranslateService) {}
  
          languages = [
            { code: 'pt', name: 'PT', flag: 'assets/flags/pt-flag.svg' },
            { code: 'en', name: 'EN', flag: 'assets/flags/us-flag.svg' },
            // Add more languages as needed
            { code: 'fr', name: 'FR', flag: 'assets/flags/fr-flag.svg' },
            { code: 'es', name: 'ES', flag: 'assets/flags/es-flag.svg' }
          ];
        
          selectedLanguage = this.languages[0]; // Default to first language
        
          onLanguageChange(event: Event) {
            const select = event.target as HTMLSelectElement;
            const langCode = select.value;
            const foundLang = this.languages.find(l => l.code === langCode);
            if (foundLang) {
              this.selectedLanguage = foundLang;
            }
          }
      
}
