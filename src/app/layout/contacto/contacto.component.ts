import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contacto',
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  contactForm: FormGroup;
  constructor(private translate: TranslateService, private fb: FormBuilder) {

    this.contactForm = this.fb.group({
      region: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      message: ['', Validators.required, Validators.minLength(10)],
      angolaCables: ['', Validators.required],

    });



  }

  submitForm(event: Event) {
    event.preventDefault();

    this.contactForm.markAllAsTouched();


    if (this.contactForm.invalid) {
      window.alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const formData = this.contactForm.value;
    const emailConfig = environment.emailjs?.contacto;

    emailjs.send(
      emailConfig?.serviceId || '',
      emailConfig?.templateId || '',
      formData,
      { publicKey: emailConfig?.publicKey || '' }
    )
      .then(() => {
        console.log('SUCESSO');
        window.alert('Mensagem enviada com sucesso! 🎉');
        this.contactForm.reset();
      })
      .catch((error: EmailJSResponseStatus) => {
        console.error('Falhou...', error.text);
        window.alert('Não foi possível enviar sua candidatura.');
      });
  }
}



