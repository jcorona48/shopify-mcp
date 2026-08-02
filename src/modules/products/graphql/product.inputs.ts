import { gidFor } from "@/shared/gid";
import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";

export function toCreateInput(input: CreateProductInput) {
  return {
    title: input.title,
    descriptionHtml: input.descriptionHtml,
    handle: input.handle,
    vendor: input.vendor,
    productType: input.productType,
    tags: input.tags,
    status: input.status,
    seo: input.seo,
    metafields: input.metafields,
    productOptions: input.productOptions?.map((o) => ({
      name: o.name,
      values: o.values?.map((v) => ({ name: v.name })),
    })),
    collectionsToJoin: input.collectionsToJoin,
  };
}

export function toUpdateInput(input: UpdateProductInput) {
  return {
    id: gidFor("Product", input.id),
    title: input.title,
    descriptionHtml: input.descriptionHtml,
    handle: input.handle,
    vendor: input.vendor,
    productType: input.productType,
    tags: input.tags,
    status: input.status,
    seo: input.seo,
    metafields: input.metafields,
    collectionsToJoin: input.collectionsToJoin,
    collectionsToLeave: input.collectionsToLeave,
    redirectNewHandle: input.redirectNewHandle,
  };
}

export interface IVariantInput {
  id?: string;
  price?: string;
  compareAtPrice?: string;
  sku?: string;
  tracked?: boolean;
  taxable?: boolean;
  barcode?: string;
  optionValues?: Array<{ optionName: string; name: string }>;
}

export function toVariantInput(v: IVariantInput) {
  return {
    id: v.id,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    sku: v.sku,
    inventoryItem: { tracked: v.tracked },
    taxable: v.taxable,
    barcode: v.barcode,
    optionValues: v.optionValues?.map((o) => ({
      optionName: o.optionName,
      name: o.name,
    })),
  };
}
