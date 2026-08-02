export interface IImageNode {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface IVariantNode {
  id: string;
  title: string;
  price: string;
  sku?: string | null;
  inventoryQuantity?: number | null;
  selectedOptions?: Array<{ name: string; value: string }>;
}

export interface IOptionValueNode {
  id: string;
  name: string;
  hasVariants?: boolean;
}

export interface IProductOptionNode {
  id: string;
  name: string;
  position?: number | null;
  optionValues?: IOptionValueNode[] | null;
  values?: Array<{ id: string; name: string }>;
}

export interface IMediaImageNode {
  id: string;
  image?: IImageNode | null;
}

export interface IProductNode {
  id: string;
  title: string;
  description?: string | null;
  descriptionHtml?: string | null;
  handle?: string | null;
  vendor?: string | null;
  productType?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  totalInventory?: number | null;
  tags?: string[] | null;
  seo?: { title?: string | null; description?: string | null } | null;
  priceRangeV2?: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  } | null;
  media?: { edges: Array<{ node: IMediaImageNode }> };
  variants?: { edges: Array<{ node: IVariantNode }> };
  options?: IProductOptionNode[] | null;
  collections?: { edges: Array<{ node: { id: string; title: string } }> };
  metafields?: {
    edges: Array<{ node: { id: string; namespace: string; key: string; value: string } }>;
  };
}
