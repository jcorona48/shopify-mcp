import type { Tool } from "@/shared/tool";
import type { ICollectionService } from "@/modules/collections/interfaces/collection-service.interface";
import { CollectionService } from "@/modules/collections/services/collection.service";
import { CollectionGraphQLRepository } from "@/modules/collections/repositories/collection-graphql.repository";
import { GetCollectionsController } from "@/modules/collections/controllers/get-collections.controller";
import { UpdateCollectionController } from "@/modules/collections/controllers/update-collection.controller";

export { CollectionService } from "@/modules/collections/services/collection.service";
export { CollectionGraphQLRepository } from "@/modules/collections/repositories/collection-graphql.repository";
export type { ICollectionService } from "@/modules/collections/interfaces/collection-service.interface";
export type { ICollectionRepository } from "@/modules/collections/repositories/collection.repository";

export function createCollectionTools(service: ICollectionService): Tool[] {
  return [
    new GetCollectionsController(service),
    new UpdateCollectionController(service),
  ];
}
