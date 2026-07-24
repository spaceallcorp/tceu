import { Component } from '@angular/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
declare var UIkit: any;

@Component({
  selector: 'app-service-form',
  imports: [MenuComponent, CommonModule, ReactiveFormsModule, RodapeComponent, TranslatePipe],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export class ServiceFormComponent {
  isSubmitting: boolean = false;
  translations: any;

  // List of available services
  servicesList = [
    { id: 'conectividade', label: 'Connectivity' },
    { id: 'acesso_internet', label: 'Internet Acess' },
    { id: 'data_center', label: 'Data Center' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'seguranca', label: 'Security' },
    { id: 'virtualizacao', label: 'virtualizacao' }
  ];

  serviceContact: FormGroup;
  selectedContactType: string = '';

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.serviceContact = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      ]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      contactType: [''],
      potCliente: [''],
      nomeEmpresa: [''],
      paisForm: [''],
      clienteAngolaCables: [''],

      // ✅ Proper FormArray for services
// ✅ Add Validators.required to the FormArray constructor
servicoInteresse: this.fb.array([], [Validators.required]),    });

    // Keep selectedContactType synchronized
    this.serviceContact.get('contactType')?.valueChanges.subscribe(value => {
      this.selectedContactType = value;
    });
  }

  // Getter for FormArray
  get servicoInteresse(): FormArray {
    return this.serviceContact.get('servicoInteresse') as FormArray;
  }

  // Handle checkbox changes
  onCheckboxChange(event: any) {
    const formArray: FormArray = this.servicoInteresse;

    if (event.target.checked) {
      formArray.push(this.fb.control(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  // Submit form
  submitForm(event: Event) {
    event.preventDefault();
    this.serviceContact.markAllAsTouched();

    if (this.serviceContact.invalid) {
      UIkit.modal('#validation-modal').show();
      return;
    }

    this.isSubmitting = true;
    UIkit.modal('#loading-modal').show();

    // Prepare form data with selected services
   const formData = {
  ...this.serviceContact.value,
  servicoInteresse: this.serviceContact.value.servicoInteresse.join(', ')
};
    console.log('Submitting form data:', formData);

    emailjs.send('service_skoexzr', 'template_32deeft', formData, {
      publicKey: 'YXh3SEpHsrETbUcfB'
    })
      .then(() => {
        console.log('SUCCESS');
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#success-modal').show();
        this.serviceContact.reset();
        this.servicoInteresse.clear(); // ✅ Clear FormArray as well
        this.isSubmitting = false;
      })
      .catch((error: EmailJSResponseStatus) => {
        console.error('FAILED...', error.text);
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#error-modal').show();
        this.isSubmitting = false;
      });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.translations.use(language);
  }
}
