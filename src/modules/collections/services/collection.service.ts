import { ShopifyNotFoundError } from "@/shared/errors";
import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";
import type {
  ICollectionResponse,
  ICollectionsResponse,
  ICollectionService,
  IListCollectionsParams,
} from "@/modules/collections/interfaces/collection-service.interface";
import type { ICollectionRepository } from "@/modules/collections/repositories/collection.repository";

export class CollectionService implements ICollectionService {
  constructor(private readonly repository: ICollectionRepository) {}

  async listCollections(params: IListCollectionsParams): Promise<ICollectionsResponse> {
    return this.repository.listCollections(params);
  }

  async updateCollection(input: UpdateCollectionInput): Promise<ICollectionResponse> {
    const collection = await this.repository.updateCollection(input);
    if (!collection) {
      throw new ShopifyNotFoundError("Collection", input.collectionId);
    }
    return { collection };
  }
}
