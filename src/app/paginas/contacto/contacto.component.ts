import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var UIkit: any;

interface Address {
  title: string;
  address: string;
  phone?: string;
}

@Component({
  selector: 'app-contacto',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, MenuComponent, RodapeComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  isSubmitting: boolean = false;


  useLanguage(language: string): void {
    this.translate.use(language);
  }

  selectedCountry: string = 'Portugal';

  

  addresses: Record<string, Address[]> = {
  
    'Portugal': [
      {
        title: 'Office',
        address: 'Rua da Alfândega, nº 64 ,<br>Ilha da Madeira, Portugal',
      }
    ],
  };

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountry = select.value;
  }

  getCountryAddresses(country: string): Address[] {
    return this.addresses[country] || [{
      title: 'Contact Support',
      address: 'Please contact us for address information in this country',
      phone: '+244 927 686 206'
    }];
  }


  contactForm: FormGroup;
  constructor(private translate: TranslateService, private fb: FormBuilder) {

    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
          phone: [
        '', 
        [
         Validators.required,
      Validators.pattern(/^\+[0-9()\-]+$/), // Must start with +
      Validators.minLength(6) // Minimum reasonable length including +
        ]
      ],region: ['', Validators.required],
      department: ['', Validators.required], // Added department field
      companyName: [''], // Added companyName field, not required
      companyPosition: [''], // Added companyPosition field, not required
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

  }


// Updated character blocking
blockInvalidPhoneChars(event: KeyboardEvent) {
  const phoneControl = this.contactForm.get('phone');
  const currentValue = phoneControl?.value || '';
  
  // Always allow navigation/control keys
  const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
  if (controlKeys.includes(event.key)) {
    return;
  }

  // First character must be +
  if (currentValue.length === 0 && event.key !== '+') {
    event.preventDefault();
    return;
  }

  // Subsequent characters must be 0-9, -, (, )
  const allowedChars = /[0-9\-()]/;
  if (currentValue.length > 0 && !allowedChars.test(event.key)) {
    event.preventDefault();
  }
}

// Updated input sanitization
sanitizePhoneInput() {
  const phoneControl = this.contactForm.get('phone');
  if (!phoneControl) return;

  let value = phoneControl.value;
  
  // Ensure it starts with +
  if (value.length > 0 && !value.startsWith('+')) {
    value = '+' + value.replace(/[^0-9]/g, '');
  }
  
  // Remove any remaining invalid characters
  value = value.replace(/[^0-9+()-]/g, '');
  
  // Update control value
  phoneControl.setValue(value, { emitEvent: false });
}

  submitForm(event: Event) {
    event.preventDefault();

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      UIkit.modal('#validation-modal').show();
      return;
    }

    this.isSubmitting = true;
    UIkit.modal('#loading-modal').show();

    const formData = this.contactForm.value;

    emailjs.send('service_9il6xco', 'template_xzxuf3r', formData, {
      publicKey: 'F-p5Ny3ufMaRfCSgR'
    })
      .then(() => {
        console.log('SUCESSO');
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#success-modal').show();
        this.contactForm.reset();
        this.isSubmitting = false;
      })
      .catch((error: EmailJSResponseStatus) => {
        console.error('Falhou...', error.text);
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#error-modal').show();
        this.isSubmitting = false;
      });
  }

}