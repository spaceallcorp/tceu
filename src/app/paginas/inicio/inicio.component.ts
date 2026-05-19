import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MenuComponent } from '../../layout/menu/menu.component';
import { AngolacablesComponent } from '../../layout/angolacables/angolacables.component';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { SliderComponent } from '../../layout/slider/slider.component';
import { EventosSListarComponent } from '../../layout/eventos-s-listar/eventos-s-listar.component';

@Component({
  selector: 'app-inicio',
  imports: [MenuComponent, AngolacablesComponent, EventosSListarComponent, RodapeComponent, SliderComponent ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  

  constructor(private auth: AuthService, private router: Router) {

  }

 ngOnInit(): void {

  const videoElement = document.getElementById('promoVideo') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true; // Forçar o vídeo a ser mudo
    }
   
  this.auth.isAuthenticated$.subscribe(isAutheticated => {
    if (isAutheticated) {
      this.router.navigate(['/painel']);
      console.log('Usuário Autenticado');
    } else {
      console.log('Usuário Não Autenticado');
    }
  })
 }

  login(){
    this.auth.loginWithRedirect();

  }

}
