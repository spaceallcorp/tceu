export interface ProdutoMetric {
  title: string;
  value: string;
}

export interface Produto {
  id: number;
  name: string;
  description: string;

  metrics: ProdutoMetric[];

  coverUrl: string;
  featuredImageUrl: string;
  ctaText: string;
  ctaUrl: string;
  productGuideUrl: string;

  productSector: string;
  productCategory: string;

  features: string[];
}