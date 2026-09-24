import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';

declare const UIkit: any;

export type ServiceType =
  | 'ip-transit' | 'dia' | 'peering' | 'gdi'
  | 'compute' | 'storage' | 'gpu' | 'backup' | 'k8s'
  | 'clean-pipe' | 'origin-protection' | 'app-protection' | 'dns-protection'
  | 'colocation' | 'cross-connect' | 'remote-hands' | 'professional-services'
  | 'bare-metal' | 'cloud-connect' | 'dr-storage';

export interface ServiceDetail {
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-quote-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './quote-order.component.html',
  styleUrl: './quote-order.component.css'
})
export class QuoteOrderComponent implements OnInit, AfterViewInit {
  selectedImage: string | null = null;
  selectedImageDesc: string | null = null;

  selectedService: ServiceType | null = null;
  selectedServiceDetail: ServiceDetail | null = null;

  // Which tab (category) is currently active: 0=Connectivity, 1=Cloud, 2=Security, 3=DataCenter
  activeTabIndex = 0;

  // Unified configuration model — covers ALL service types
  configData = {
    // Connectivity
    locationA: '',
    locationB: '',
    primaryLocation: '',
    capacity: '10 Gbps',
    technologyProtocol: '',
    // Cloud
    cloudRegion: 'Lisbon DC1 (Europe South)',
    cloudSizing: '',
    cloudArchitecture: '',
    // Security
    securityTarget: '',
    securityVolume: '',
    securityMode: '',
    // Data Center
    dcTarget: '',
    dcSizing: '',
    dcRedundancy: ''
  };

  formData = {
    user_name: '',
    user_email: '',
    user_phone: '',
    company_name: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  private readonly EMAILJS_SERVICE_ID = 'service_yhmv9kn';
  private readonly EMAILJS_TEMPLATE_ID = 'template_p1696fw';
  private readonly EMAILJS_PUBLIC_KEY = 's3ApW9433DP5gZtVb';

  // Map each service to its parent tab index
  private readonly serviceTabMap: Record<ServiceType, number> = {
    'ip-transit': 0, 'dia': 0, 'peering': 0, 'gdi': 0,
    'compute': 1, 'storage': 1, 'backup': 1, 'gpu': 1, 'k8s': 1,
    'clean-pipe': 2, 'origin-protection': 2, 'app-protection': 2, 'dns-protection': 2,
    'colocation': 3, 'bare-metal': 3, 'cloud-connect': 3, 'dr-storage': 3,
    'cross-connect': 3, 'remote-hands': 3, 'professional-services': 3
  };

  serviceDetailsMap: Record<ServiceType, ServiceDetail> = {
    'ip-transit': { title: 'IP Transit', description: 'High-capacity global IP reachability and full BGP routing over subsea cable systems.', features: ['Tier-1 direct peering', 'Low latency subsea routes', 'BGP routing controls', 'SLA 99.99%'] },
    'dia': { title: 'Direct Internet Access', description: 'Dedicated, symmetric high-bandwidth internet connectivity for enterprise networks.', features: ['1:1 dedicated bandwidth', 'Symmetrical speeds', '24/7 proactive NOC support', 'Custom SLAs'] },
    'peering': { title: 'Remote Peering', description: 'Direct traffic exchange with major global IXPs, CDNs, and tier-1 networks without local POP presence.', features: ['Access to 30+ IXPs', 'Reduced transit costs', 'Optimized routing paths', 'Scalable ports'] },
    'gdi': { title: 'Global Data Center Interconnection', description: 'Global Data Center Interconnection offering seamless L2 and L3 connectivity between facilities worldwide.', features: ['Encrypted transmission', 'Deterministic latency', 'Point-to-Point & Multi-Point', 'High availability'] },
    'compute': { title: 'Cloud Compute', description: 'High-performance virtual instances, dedicated vCPUs, and auto-scaling cloud resources on demand.', features: ['Elastic sizing', 'High-speed local SSDs', 'Automated backups', 'Pay-as-you-go pricing'] },
    'storage': { title: 'Cloud Storage', description: 'Scalable S3-compatible Object Storage, high-IOPS Block Storage, and distributed File shares.', features: ['S3-compatible API', '99.999999999% durability', 'Encryption at rest', 'Tiered storage classes'] },
    'gpu': { title: 'GPU as a Service', description: 'High-performance GPU acceleration for AI/ML training, LLM inference, 3D rendering, and HPC workloads.', features: ['NVIDIA enterprise GPUs', 'High-bandwidth interconnects', 'Pre-configured AI frameworks', 'Scalable nodes'] },
    'backup': { title: 'Backup as a Service', description: 'Automated, immutable enterprise backup and rapid disaster recovery with strict SLA guarantees.', features: ['Automated scheduling', 'Ransomware protection', 'Granular restore options', 'End-to-end encryption'] },
    'k8s': { title: 'Managed Kubernetes', description: 'Production-ready container orchestration managed by cloud infrastructure experts.', features: ['Automated cluster upgrades', 'High availability control plane', 'Integrated ingress', 'Auto-scaling'] },
    'clean-pipe': { title: 'Clean Pipe (IP / ASN DDoS Protection)', description: 'Volumetric DDoS mitigation scrubbing malicious traffic before it reaches your IP prefixes.', features: ['Inline scrubbing center', 'Zero latency overhead', 'Volumetric attack defense', 'Real-time telemetry'] },
    'origin-protection': { title: 'Origin Protection & Tunnel Shield', description: 'Encrypted GRE/IPsec tunnels and IP masking to shield core data center servers and cloud origins.', features: ['IP masking', 'Encrypted tunnel delivery', 'Zero direct public exposure', 'Always-on defense'] },
    'app-protection': { title: 'Application & WAF Protection', description: 'Next-generation Web Application Firewall (WAF), API security, and rate-limiting to block OWASP Top 10 threats.', features: ['Bot mitigation', 'API security', 'Custom security rulesets', 'Real-time threat analytics'] },
    'dns-protection': { title: 'Managed Anycast DNS Protection', description: 'Anycast DNS infrastructure with integrated DNSSEC and DNS DDoS protection for continuous domain uptime.', features: ['Global Anycast network', 'DNSSEC support', 'DDoS resilient DNS', 'Low latency lookups'] },
    'colocation': { title: 'Data Center Colocation & Rack Space', description: 'Secure rack space with redundant power feeds, precision cooling, and carrier-neutral connectivity.', features: ['Tier III certified facility', 'N+1 redundant power & HVAC', '24/7 biometric access', 'Direct carrier cross-connects'] },
    'bare-metal': { title: 'Dedicated Bare Metal Compute', description: 'High-performance dedicated single-tenant hardware with root access and automated provisioning.', features: ['No hypervisor overhead', 'Custom hardware specs', 'Direct root access', 'High-throughput networking'] },
    'cloud-connect': { title: 'Direct Interconnection & Cloud Connect', description: 'Direct private cross-connects to hyper-scale clouds, internet exchanges, and telecom carriers.', features: ['SLA-backed latency', 'Enhanced data security', 'Lower egress costs', 'Flexible bandwidth choices'] },
    'dr-storage': { title: 'Disaster Recovery & Enterprise Storage', description: 'S3-compatible Object Storage, SAN arrays, and automated Disaster Recovery replication environments.', features: ['Geo-replicated sites', 'Near-zero RPO/RTO options', 'Automated failover triggers', 'Compliance ready'] },
    'cross-connect': { title: 'Cross Connects', description: 'Direct physical cable connections between equipment in our data centers.', features: ['Fiber, Copper & Coaxial', 'Low-latency connections', 'Fast deployment', 'Custom routing'] },
    'remote-hands': { title: 'Remote Hands Support', description: 'On-site technical support performed by certified data center technicians.', features: ['24/7 availability', 'Hardware inspection', 'Cable patching', 'Equipment installation'] },
    'professional-services': { title: 'Professional Services', description: 'Consulting, architectural design, and migration management for network and cloud.', features: ['Network design', 'Cloud migration support', 'Performance auditing', 'Dedicated project managers'] }
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  selectService(service: ServiceType): void {
    this.selectedService = this.selectedService === service ? null : service;
    this.submitSuccess = false;
    this.submitError = null;

    // Set default tech values depending on selected service
    switch (this.selectedService) {
      case 'ip-transit': this.configData.technologyProtocol = 'Full BGP Table (IPv4 + IPv6)'; break;
      case 'dia': this.configData.technologyProtocol = 'Dedicated Fiber (Single Homed)'; break;
      case 'peering': this.configData.technologyProtocol = 'DE-CIX Frankfurt'; break;
      case 'gdi': this.configData.technologyProtocol = 'Protected DWDM (Optical Wavelength)'; break;
      case 'compute': this.configData.cloudArchitecture = 'General Purpose (SSD)'; break;
      case 'storage': this.configData.cloudArchitecture = 'S3 Object Storage (NVMe/HDD)'; break;
      case 'backup': this.configData.cloudArchitecture = 'Veeam Cloud Connect Integration'; break;
      case 'gpu': this.configData.cloudArchitecture = 'NVIDIA L40S (Inference & Graphics)'; break;
      case 'clean-pipe': this.configData.securityMode = 'Always-On BGP Announce'; break;
      case 'origin-protection': this.configData.securityMode = 'Encrypted GRE Tunnel Pair'; break;
      case 'app-protection': this.configData.securityMode = 'Cloud WAF + Bot Management'; break;
      case 'dns-protection': this.configData.securityMode = 'Primary Anycast Authoritative DNS'; break;
      case 'colocation': this.configData.dcRedundancy = 'Tier III Dual Feed (A+B Power)'; break;
      case 'bare-metal': this.configData.dcRedundancy = 'Single Node + Hardware Replacement SLA'; break;
      case 'cloud-connect': this.configData.dcRedundancy = 'Single Fiber Port Direct Link'; break;
      case 'dr-storage': this.configData.dcRedundancy = 'Daily Async Backup Snapshot'; break;
    }
  }

  /** Called when user switches tab — resets any open config card */
  onTabChange(index: number): void {
    this.activeTabIndex = index;
    this.selectedService = null;
  }

  learnMore(service: ServiceType, event: Event): void {
    event.stopPropagation();
    this.selectedServiceDetail = this.serviceDetailsMap[service];
    if (typeof UIkit !== 'undefined') {
      UIkit.modal('#modal-learn-more').show();
    }
  }

  onSelectImage(image: string, desc?: string): void {
    this.selectedImage = image;
    this.selectedImageDesc = desc || null;
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  /**
   * Build a location/summary string based on service type.
   */
  private buildLocationInfo(): string {
    const s = this.selectedService;
    if (!s) return 'N/A';

    if (s === 'gdi') {
      return `Location A: ${this.configData.locationA || 'N/A'} | Location B: ${this.configData.locationB || 'N/A'}`;
    }
    if (['ip-transit', 'dia', 'peering'].includes(s)) {
      return `Primary Location: ${this.configData.primaryLocation || 'N/A'}`;
    }
    if (['compute', 'storage', 'backup', 'gpu', 'k8s'].includes(s)) {
      return `Cloud Region: ${this.configData.cloudRegion || 'N/A'}`;
    }
    if (['clean-pipe', 'origin-protection', 'app-protection', 'dns-protection'].includes(s)) {
      return `Target: ${this.configData.securityTarget || 'N/A'}`;
    }
    if (['colocation', 'bare-metal', 'cloud-connect', 'dr-storage'].includes(s)) {
      return `Target: ${this.configData.dcTarget || 'N/A'}`;
    }
    return 'N/A';
  }

  /**
   * Pick the correct capacity/sizing value for the selected service.
   */
  private buildCapacity(): string {
    const s = this.selectedService;
    if (!s) return 'N/A';
    if (['ip-transit', 'dia', 'peering', 'gdi'].includes(s)) return this.configData.capacity;
    if (['compute', 'storage', 'backup', 'gpu', 'k8s'].includes(s)) return this.configData.cloudSizing || 'N/A';
    if (['clean-pipe', 'origin-protection', 'app-protection', 'dns-protection'].includes(s)) return this.configData.securityVolume || 'N/A';
    if (['colocation', 'bare-metal', 'cloud-connect', 'dr-storage'].includes(s)) return this.configData.dcSizing || 'N/A';
    return 'N/A';
  }

  /**
   * Pick the correct technology/protocol value.
   */
  private buildTechnology(): string {
    const s = this.selectedService;
    if (!s) return 'N/A';
    if (['ip-transit', 'dia', 'peering', 'gdi'].includes(s)) return this.configData.technologyProtocol || 'N/A';
    if (['compute', 'storage', 'backup', 'gpu', 'k8s'].includes(s)) return this.configData.cloudArchitecture || 'N/A';
    if (['clean-pipe', 'origin-protection', 'app-protection', 'dns-protection'].includes(s)) return this.configData.securityMode || 'N/A';
    if (['colocation', 'bare-metal', 'cloud-connect', 'dr-storage'].includes(s)) return this.configData.dcRedundancy || 'N/A';
    return 'N/A';
  }

  async sendConfiguration(): Promise<void> {
    if (!this.formData.user_email) {
      this.submitError = 'Please provide your work email address.';
      return;
    }
    if (!this.selectedService) {
      this.submitError = 'Please select a service to configure.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    const selectedServiceTitle = this.serviceDetailsMap[this.selectedService]?.title || this.selectedService;

    const templateParams = {
      work_email: this.formData.user_email,
      user_name: this.formData.user_name || 'N/A',
      phone: this.formData.user_phone || 'N/A',
      company: this.formData.company_name || 'N/A',
      selected_service: selectedServiceTitle,
      service_locations: this.buildLocationInfo(),
      port_capacity: this.buildCapacity(),
      technology_protocol: this.buildTechnology(),
      message: this.formData.message || 'No additional notes provided.'
    };

    try {
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );
      this.submitSuccess = true;
      this.openSuccessModal();
      this.resetForm();
    } catch (error: any) {
      console.error('[QuoteOrderComponent] EmailJS error:', error);
      this.submitError = 'Failed to send message. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private openSuccessModal(): void {
    if (typeof UIkit !== 'undefined') {
      UIkit.modal('#modal-success').show();
    }
  }

  private resetForm(): void {
    this.formData = {
      user_name: '', user_email: '', user_phone: '', company_name: '', message: ''
    };
    this.configData = {
      locationA: '', locationB: '', primaryLocation: '',
      capacity: '10 Gbps', technologyProtocol: '',
      cloudRegion: 'Lisbon DC1 (Europe South)',
      cloudSizing: '', cloudArchitecture: '',
      securityTarget: '', securityVolume: '', securityMode: '',
      dcTarget: '', dcSizing: '', dcRedundancy: ''
    };
    this.selectedService = null;
  }

  /** Close success modal and reset states */
  closeSuccessModal(): void {
    if (typeof UIkit !== 'undefined') {
      UIkit.modal('#modal-success').hide();
    }
    this.submitSuccess = false;
  }

  ngAfterViewInit(): void {
    if (typeof UIkit === 'undefined') return;
    const modalElement = document.getElementById('modal-video');
    const video = document.getElementById('promoVideo') as HTMLVideoElement | null;
    if (modalElement && video) {
      modalElement.addEventListener('hidden', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  }
}