import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { ProductService } from '../../services/product.service';
import { Produto } from '../../models/products.models';
import { MenuComponent } from '../menu/menu.component';
import { RodapeComponent } from '../rodape/rodape.component';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent,
    RodapeComponent
  ],
  templateUrl: './produto-detail.component.html',
  styleUrl: './produto-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private cdr = inject(ChangeDetectorRef); // Injeção do ChangeDetectorRef

  private subscriptions = new Subscription();
  private reloadTrigger$ = new BehaviorSubject<void>(undefined);

  productName = '';
  product: Produto | null = null;
  relatedProducts: Produto[] = [];

  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    // 1. Título da página
    this.subscriptions.add(
      this.route.data.subscribe(data => {
        this.productName = data['productName'] || 'Produto';
        this.titleService.setTitle(`${this.productName} - TelCables South Africa`);
        this.cdr.markForCheck();
      })
    );

    // 2. Carregamento direto do produto por ID
    this.subscriptions.add(
      combineLatest([this.route.paramMap, this.reloadTrigger$]).pipe(
        switchMap(([params]) => {
          const id = params.get('id');

          if (!id) {
            this.errorMessage = 'Produto não encontrado';
            this.isLoading = false;
            this.cdr.markForCheck();
            return of(null);
          }

          this.isLoading = true;
          this.errorMessage = '';
          this.cdr.markForCheck();

          // Busca apenas o produto selecionado
          return this.productService.getProductById(id).pipe(
            catchError(err => {
              console.error('Error loading product:', err);
              this.errorMessage = 'Erro ao carregar produto. Por favor, tente novamente.';
              this.isLoading = false;
              this.cdr.markForCheck();
              return of(null);
            })
          );
        })
      ).subscribe(product => {
        this.product = product;
        this.isLoading = false;

        if (!product) {
          if (!this.errorMessage) this.errorMessage = 'Produto não encontrado';
          this.cdr.markForCheck(); // Notifica o Angular sobre a alteração de estado
          return;
        }

        // Carrega produtos relacionados em background
        this.loadRelatedProducts(product);
        this.scrollToContent();

        this.cdr.markForCheck(); // Notifica o Angular para atualizar o template imediatamente
      })
    );
  }

  private loadRelatedProducts(currentProduct: Produto): void {
    this.productService.getProducts().subscribe(products => {
      this.relatedProducts = products
        .filter(p =>
          p.id !== currentProduct.id &&
          (p.productCategory === currentProduct.productCategory ||
            p.productSector === currentProduct.productSector)
        )
        .slice(0, 4);

      this.cdr.markForCheck(); // Força a re-renderização ao carregar os relacionados
    });
  }

  loadProduct(): void {
    this.reloadTrigger$.next();
  }

  ngOnDestroy(): void {
    // Cancela todas as subscrições acumuladas de uma só vez
    this.subscriptions.unsubscribe();
  }

  formatBigNumber(value?: string, title?: string): string {
    if (!value) return 'N/A';
    const titleLower = title?.toLowerCase() || '';

    if ((titleLower.includes('percent') || titleLower.includes('%') || titleLower.includes('taxa') || titleLower.includes('uptime')) && !value.includes('%')) {
      return `${value}%`;
    }
    return value;
  }

  getBigNumberIcon(title: string, index: number): string {
    const iconMap: Record<string, string> = {
      'clientes': '👥',
      'usuários': '👤',
      'vendas': '💰',
      'receita': '💵',
      'uptime': '⏱️',
      'disponibilidade': '🟢',
      'performance': '⚡',
      'escalabilidade': '📊'
    };

    const titleLower = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (titleLower.includes(key)) return icon;
    }

    const defaultIcons = ['📈', '🚀', '🌍', '⚡', '🎯', '💎', '🔧', '⭐'];
    return defaultIcons[index % defaultIcons.length];
  }

  getBigNumberTrend(title: string, value: number): string {
    if (value > 10000) return '🚀 Crescimento excepcional';
    if (value > 5000) return '📈 Crescimento acelerado';
    if (value > 1000) return '✅ Excelente desempenho';
    if (value > 500) return '👍 Bom progresso';
    if (value > 100) return '📊 Resultado positivo';
    return '💪 Em desenvolvimento';
  }

  getShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 180 ? description.substring(0, 180) + '...' : description;
  }

  getShortChallenge(challenge?: string): string {
    if (!challenge) return '';
    return challenge.length > 180 ? challenge.substring(0, 180) + '...' : challenge;
  }

  getShortSolution(solution?: string): string {
    if (!solution) return '';
    return solution.length > 180 ? solution.substring(0, 180) + '...' : solution;
  }


  scrollToContent(): void {
    const element = document.querySelector('.product-detail-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showTooltip(event: MouseEvent, text: string): void {
    this.tooltipText = text;
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;

    setTimeout(() => {
      if (this.tooltipText === text) this.hideTooltip();
    }, 2000);
  }

  hideTooltip(): void {
    this.tooltipText = '';
  }

  navigateToProduct(id: string | number): void {
    this.router.navigate(['/product', id]);
  }

  trackByProductId(index: number, item: Produto): string | number {
    return item.id;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/images/placeholder-product.jpg';
  }

  openContactForm(): void {
    this.router.navigate(['/contact']);
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product?.name || 'Produto');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`, '_blank');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Confira ${this.product?.name} - ${this.product?.description?.substring(0, 100)}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showTooltipMessage('Link copiado com sucesso!');
    }).catch(() => {
      this.showTooltipMessage('Erro ao copiar link');
    });
  }

  private showTooltipMessage(message: string): void {
    const tempTooltip = document.createElement('div');
    tempTooltip.textContent = message;
    tempTooltip.style.position = 'fixed';
    tempTooltip.style.bottom = '20px';
    tempTooltip.style.right = '20px';
    tempTooltip.style.backgroundColor = '#28C1FD';
    tempTooltip.style.color = '#03121f';
    tempTooltip.style.padding = '12px 24px';
    tempTooltip.style.borderRadius = '12px';
    tempTooltip.style.zIndex = '10000';
    tempTooltip.style.fontWeight = 'bold';
    document.body.appendChild(tempTooltip);

    setTimeout(() => tempTooltip.remove(), 2000);
  }
}