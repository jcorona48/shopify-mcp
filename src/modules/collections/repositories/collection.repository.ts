import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";
import type { ICollection } from "@/modules/collections/entities/collection.entity";
import type {
  ICollectionsResponse,
  IListCollectionsParams,
} from "@/modules/collections/interfaces/collection-service.interface";

export interface ICollectionRepository {
  listCollections(params: IListCollectionsParams): Promise<ICollectionsResponse>;
  updateCollection(input: UpdateCollectionInput): Promise<ICollection | null>;
}
