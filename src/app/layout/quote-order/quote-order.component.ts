import { AfterViewInit, Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for form binding
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';
declare const UIkit: any; // Access UIkit globally



export type ServiceType = 
  | 'ip-transit' 
  | 'dia' 
  | 'peering' 
  | 'gdi' 
  | 'compute' 
  | 'storage' 
  | 'gpu' 
  | 'backup' 
  | 'k8s'
  | 'clean-pipe' 
  | 'origin-protection' 
  | 'app-protection' 
  | 'dns-protection'
  | 'colocation'
  | 'cross-connect'
  | 'remote-hands'
  | 'professional-services'
  | 'bare-metal'
  | 'cloud-connect'
  | 'dr-storage';

export interface ServiceDetail {
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-quote-order',
  imports: [

  CommonModule,
    FormsModule, // Added FormsModule here
    TranslatePipe
  ],
  templateUrl: './quote-order.component.html',
  styleUrl: './quote-order.component.css'
})

export class QuoteOrderComponent  implements OnInit, AfterViewInit{ selectedImage: string | null = null;
  selectedImageDesc: string | null = null;

  // Selected service state
  selectedService: ServiceType | null = null;
  selectedServiceDetail: ServiceDetail | null = null;

  // Contact / Configuration Form Model
  formData = {
    user_name: '',
    user_email: '',
    user_phone: '',
    company_name: '',
    message: ''
  };

  // Form Submission UI states
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string | null = null;

  // EmailJS Configuration Keys (Replace with your actual keys)
  private readonly EMAILJS_SERVICE_ID = 'service_yhmv9kn';
  private readonly EMAILJS_TEMPLATE_ID = 'template_p1696fw';
  private readonly EMAILJS_PUBLIC_KEY = 's3ApW9433DP5gZtVb';

  serviceDetailsMap: Record<ServiceType, ServiceDetail> = {
    'ip-transit': {
      title: 'IP Transit',
      description: 'High-capacity global IP reachability and full BGP routing over subsea cable systems.',
      features: ['Tier-1 direct peering', 'Low latency subsea routes', 'BGP routing controls', 'SLA 99.99%']
    },
    'dia': {
      title: 'Dedicated Internet Access (DIA)',
      description: 'Guaranteed, symmetrical high-speed internet connectivity for mission-critical operations.',
      features: ['1:1 dedicated bandwidth', 'Symmetrical speeds', '24/7 proactive NOC support', 'Custom SLAs']
    },
    'peering': {
      title: 'Remote Peering',
      description: 'Direct connection to major global Internet Exchange Points (IXPs) without physical presence.',
      features: ['Access to 30+ IXPs', 'Reduced transit costs', 'Optimized routing paths', 'Scalable ports']
    },
    'gdi': {
      title: 'Global Data Interconnect (GDI)',
      description: 'Private Layer 2 and Layer 3 connections linking core data centers globally.',
      features: ['Encrypted transmission', 'Deterministic latency', 'Point-to-Point & Multi-Point', 'High availability']
    },
    'compute': {
      title: 'Cloud Compute',
      description: 'Scalable cloud virtual machines optimized for enterprise workloads.',
      features: ['Elastic sizing', 'High-speed local SSDs', 'Automated backups', 'Pay-as-you-go pricing']
    },
    'storage': {
      title: 'Object & Block Storage',
      description: 'High-durability storage solutions for enterprise data and static assets.',
      features: ['S3-compatible API', '99.999999999% durability', 'Encryption at rest', 'Tiered storage classes']
    },
    'gpu': {
      title: 'GPU Cloud Processing',
      description: 'High-performance computing clusters powered by enterprise GPUs for AI and ML training.',
      features: ['NVIDIA enterprise GPUs', 'High-bandwidth interconnects', 'Pre-configured AI frameworks', 'Scalable nodes']
    },
    'backup': {
      title: 'Cloud Backup',
      description: 'Automated off-site cloud backups ensuring operational resilience.',
      features: ['Automated scheduling', 'Ransomware protection', 'Granular restore options', 'End-to-end encryption']
    },
    'k8s': {
      title: 'Managed Kubernetes',
      description: 'Production-ready container orchestration managed by cloud infrastructure experts.',
      features: ['Automated cluster upgrades', 'High availability control plane', 'Integrated ingress', 'Auto-scaling']
    },
    'clean-pipe': {
      title: 'Clean Pipe DDoS Protection',
      description: 'Real-time volumetric and protocol DDoS mitigation at the carrier network level.',
      features: ['Inline scrubbing center', 'Zero latency overhead', 'Volumetric attack defense', 'Real-time telemetry']
    },
    'origin-protection': {
      title: 'Origin Protection',
      description: 'Secure your infrastructure origin IP from targeted cyber threats and exposure.',
      features: ['IP masking', 'Encrypted tunnel delivery', 'Zero direct public exposure', 'Always-on defense']
    },
    'app-protection': {
      title: 'Application Security (WAF)',
      description: 'Web Application Firewall shielding web apps and APIs against OWASP Top 10 vulnerabilities.',
      features: ['Bot mitigation', 'API security', 'Custom security rulesets', 'Real-time threat analytics']
    },
    'dns-protection': {
      title: 'DNS Protection',
      description: 'Anycast DNS infrastructure providing high availability and built-in DNS-layer security.',
      features: ['Global Anycast network', 'DNSSEC support', 'DDoS resilient DNS', 'Low latency lookups']
    },
    'colocation': {
      title: 'Data Center Colocation',
      description: 'Secure, carrier-neutral rack space with redundant power, cooling, and physical security.',
      features: ['Tier III certified facility', 'N+1 redundant power & HVAC', '24/7 biometric access', 'Direct carrier cross-connects']
    },
    'cross-connect': {
      title: 'Cross Connects',
      description: 'Direct physical cable connections between equipment in our data centers.',
      features: ['Fiber, Copper & Coaxial options', 'Low-latency connections', 'Fast deployment', 'Custom routing']
    },
    'remote-hands': {
      title: 'Remote Hands Support',
      description: 'On-site technical support performed by certified data center technicians.',
      features: ['24/7 availability', 'Hardware visual inspection', 'Cable patching & power cycling', 'Equipment installation']
    },
    'professional-services': {
      title: 'Professional Services',
      description: 'Consulting, architectural design, and migration management for network and cloud.',
      features: ['Network design', 'Cloud migration support', 'Performance auditing', 'Dedicated project managers']
    },
    'bare-metal': {
      title: 'Bare Metal Servers',
      description: 'Dedicated single-tenant physical hardware providing maximum processing power and control.',
      features: ['No hypervisor overhead', 'Custom hardware specs', 'Direct root access', 'High-throughput networking']
    },
    'cloud-connect': {
      title: 'Direct Cloud Connect',
      description: 'Bypass the public internet with direct, private connections to AWS, Azure, Google Cloud, and Oracle.',
      features: ['SLA-backed latency', 'Enhanced data security', 'Lower egress costs', 'Flexible bandwidth choices']
    },
    'dr-storage': {
      title: 'Disaster Recovery Storage',
      description: 'Geo-redundant storage replication for rapid failover during catastrophic events.',
      features: ['Geo-replicated sites', 'Near-zero RPO/RTO options', 'Automated failover triggers', 'Compliance ready']
    }
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
  
  }

  selectService(service: ServiceType) {
    this.selectedService = this.selectedService === service ? null : service;
  }

  learnMore(service: ServiceType, event: Event): void {
    event.stopPropagation();
    this.selectedServiceDetail = this.serviceDetailsMap[service] || {
      title: service,
      description: 'Detailed information for this service will be available shortly.',
      features: []
    };

    if (typeof UIkit !== 'undefined') {
      UIkit.modal('#modal-learn-more').show();
    }
  }

  onSelectImage(image: string, desc?: string) {
    this.selectedImage = image;
    this.selectedImageDesc = desc || null;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  /**
   * Sends configuration and user form details using EmailJS
   */
  async sendConfiguration(): Promise<void> {
    if (!this.formData.user_name || !this.formData.user_email) {
      this.submitError = 'Please provide both your name and email address.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    // Get selected service title
    const selectedServiceTitle = this.selectedService
      ? this.serviceDetailsMap[this.selectedService]?.title || this.selectedService
      : 'None Selected';

    // Prepare dynamic values for EmailJS template
    const templateParams = {
      work_email: this.formData.user_email,
      phone: this.formData.user_phone || 'N/A',
      company: this.formData.company_name || 'N/A',
      selected_service: selectedServiceTitle,
      message: this.formData.message || 'No additional message provided.',
    };

    try {
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      this.submitSuccess = true;
      this.resetForm();
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      this.submitError = 'Failed to send message. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm(): void {
    this.formData = {
      user_name: '',
      user_email: '',
      user_phone: '',
      company_name: '',
      message: ''
    };
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
