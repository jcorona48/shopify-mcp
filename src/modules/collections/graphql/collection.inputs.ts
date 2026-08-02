import { gidFor } from "@/shared/gid";
import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";

export function toUpdateCollectionInput(input: UpdateCollectionInput) {
  return {
    id: gidFor("Collection", input.collectionId),
    title: input.title,
    descriptionHtml: input.descriptionHtml ?? input.description,
    seo: input.seo,
  };
}
