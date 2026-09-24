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
  featuredImageUrl2: string;

  ctaText: string;
  ctaUrl: string;
  productGuideUrl: string;

  solution: string;

  productSector: string;
  productCategory: string;
  challenges: string;

  features: string[];
}