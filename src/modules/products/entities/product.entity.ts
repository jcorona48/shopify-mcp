import type { Metafield, Money, Seo } from "@/shared/types";
import type { IProductVariant } from "./product-variant.entity";
import type { IProductOption } from "./product-option.entity";

export interface IPriceRange {
  minPrice: Money;
  maxPrice: Money;
}

export interface IProductImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface IProduct {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle?: string;
  vendor?: string;
  productType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  totalInventory?: number;
  tags?: string[];
  seo?: Seo | null;
  priceRange?: IPriceRange;
  imageUrl?: string | null;
  images?: IProductImage[];
  variants?: IProductVariant[];
  options?: IProductOption[];
  collections?: Array<{ id: string; title: string }>;
  metafields?: Metafield[];
}
