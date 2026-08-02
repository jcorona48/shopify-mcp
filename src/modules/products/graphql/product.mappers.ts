import type {
  IProduct,
  IProductImage,
} from "@/modules/products/entities/product.entity";
import type {
  IProductOption,
  IProductOptionValue,
} from "@/modules/products/entities/product-option.entity";
import type { IProductVariant } from "@/modules/products/entities/product-variant.entity";
import type {
  IImageNode,
  IOptionValueNode,
  IProductNode,
  IProductOptionNode,
  IVariantNode,
} from "@/modules/products/graphql/product.nodes";

export function toImage(node: IImageNode): IProductImage {
  return {
    id: node.id ?? undefined,
    url: node.url,
    altText: node.altText ?? undefined,
    width: node.width ?? undefined,
    height: node.height ?? undefined,
  };
}

export function toVariant(node: IVariantNode): IProductVariant {
  return {
    id: node.id,
    title: node.title,
    price: node.price,
    sku: node.sku ?? "",
    inventoryQuantity: node.inventoryQuantity ?? undefined,
    options: (node.selectedOptions ?? []).map((o) => ({
      name: o.name,
      value: o.value,
    })),
  };
}

export function toOption(node: IProductOptionNode): IProductOption {
  const raw = node.optionValues ?? node.values ?? [];
  const values: IProductOptionValue[] = raw.map((v) => ({
    id: v.id,
    name: v.name,
    hasVariants:
      "hasVariants" in v ? Boolean((v as IOptionValueNode).hasVariants) : false,
  }));

  return {
    id: node.id,
    name: node.name,
    position: node.position ?? undefined,
    values,
  };
}

export function toProduct(node: IProductNode): IProduct {
  const images: IProductImage[] = (node.media?.edges ?? [])
    .map((edge) => edge.node.image)
    .filter((image): image is IImageNode => image != null)
    .map(toImage);

  return {
    id: node.id,
    title: node.title,
    description: node.description ?? undefined,
    descriptionHtml: node.descriptionHtml ?? undefined,
    handle: node.handle ?? undefined,
    vendor: node.vendor ?? undefined,
    productType: node.productType ?? undefined,
    status: node.status ?? undefined,
    createdAt: node.createdAt ?? undefined,
    updatedAt: node.updatedAt ?? undefined,
    totalInventory: node.totalInventory ?? undefined,
    tags: node.tags ?? undefined,
    seo: node.seo
      ? { title: node.seo.title ?? "", description: node.seo.description ?? "" }
      : null,
    priceRange: node.priceRangeV2
      ? {
          minPrice: {
            amount: node.priceRangeV2.minVariantPrice.amount,
            currencyCode: node.priceRangeV2.minVariantPrice.currencyCode,
          },
          maxPrice: {
            amount: node.priceRangeV2.maxVariantPrice.amount,
            currencyCode: node.priceRangeV2.maxVariantPrice.currencyCode,
          },
        }
      : undefined,
    imageUrl: images[0]?.url ?? null,
    images: images.length > 0 ? images : undefined,
    variants: node.variants?.edges.map((e) => toVariant(e.node)),
    options: node.options?.map(toOption),
    collections: node.collections?.edges.map((e) => e.node),
    metafields: node.metafields?.edges.map((e) => e.node),
  };
}
