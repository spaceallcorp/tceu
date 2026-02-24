import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { DatacenterComponent } from './paginas/datacenter/datacenter.component';
import { AcercaComponent } from './paginas/acerca/acerca.component';
import { EventosComponent } from './layout/eventos/eventos.component';
import { EventosAcComponent } from './paginas/eventos-ac/eventos-ac.component';
import { BlogComponent } from './paginas/blog/blog.component';
import { ConectividadeComponent } from './paginas/conectividade/conectividade.component';
import { CloudservicesComponent } from './paginas/cloudservices/cloudservices.component';
import { DatacentersevicesComponent } from './paginas/datacentersevices/datacentersevices.component';
import { SegurancaComponent } from './paginas/seguranca/seguranca.component';
import { NoticiasComponent } from './paginas/noticias/noticias.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';

import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { ServiceFormComponent } from './layout/service-form/service-form.component';
import { PrivacypolicyComponent } from './paginas/privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './paginas/termsandconditions/termsandconditions.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'company', component: AcercaComponent },

  { path: 'datacenter', component: DatacenterComponent },
  { path: 'eventos', component: EventosAcComponent },
  { path: 'solutions', component: BlogComponent },
  { path: 'connectivity', component: ConectividadeComponent },
  { path: 'cloud', component: CloudservicesComponent },
  { path: 'data-center', component: DatacentersevicesComponent },
  { path: 'security', component: SegurancaComponent },
  { path: 'contact', component: ContactoComponent },
  { path: 'datacenter', component: DatacentersevicesComponent },

  { path: 'service-contact', component: ServiceFormComponent },

  { path: 'mkt-proibido', component: DashboardComponent },

  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'termsandconditions', component: TermsandconditionsComponent },

  {
    path: 'solution',
    loadComponent: () =>
      import('./paginas/solutions/solutions.component').then(
        (m) => m.SolutionsComponent,
      ),
  },

  {
    path: 'cookies-policy',
    loadComponent: () =>
      import('./paginas/cookies-policy/cookies-policy.component').then(
        (m) => m.CookiesPolicyComponent,
      ),
  },

  {
    path: 'news',
    loadComponent: () =>
      import('./paginas/noticias/noticias.component').then(
        (m) => m.NoticiasComponent,
      ),
  },
  {
    path: 'solution/:id',
    loadComponent: () =>
      import('./layout/artigo/artigo.component').then((m) => m.ArtigoComponent),
  },

  {
    path: 'postar',
    loadComponent: () =>
      import('./layout/artigo-postar/artigo-postar.component').then(
        (m) => m.ArtigoPostarComponent,
      ),
  },

  {
    path: 'postar-vaga',
    loadComponent: () =>
      import('./layout/vagas-criar/vagas-criar.component').then(
        (m) => m.VagasCriarComponent,
      ),
  },
];
