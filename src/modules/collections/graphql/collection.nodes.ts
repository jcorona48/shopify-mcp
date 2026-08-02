export interface ICollectionNode {
  id: string;
  title: string;
  handle?: string | null;
  description?: string | null;
  descriptionHtml?: string | null;
  updatedAt?: string | null;
  productsCount?: { count?: number | null } | null;
  seo?: { title?: string | null; description?: string | null } | null;
}
