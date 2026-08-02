export interface ICollection {
  id: string;
  title: string;
  handle?: string;
  description?: string;
  descriptionHtml?: string;
  updatedAt?: string;
  productsCount?: number;
  seo?: { title?: string; description?: string } | null;
}
