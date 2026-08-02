import type { ICollection } from "@/modules/collections/entities/collection.entity";
import type { ICollectionNode } from "@/modules/collections/graphql/collection.nodes";

export function toCollection(node: ICollectionNode): ICollection {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle ?? undefined,
    description: node.description ?? undefined,
    descriptionHtml: node.descriptionHtml ?? undefined,
    updatedAt: node.updatedAt ?? undefined,
    productsCount: node.productsCount?.count ?? undefined,
    seo: node.seo
      ? { title: node.seo.title ?? "", description: node.seo.description ?? "" }
      : null,
  };
}
