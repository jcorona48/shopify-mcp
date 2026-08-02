import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";
import type { ICollection } from "@/modules/collections/entities/collection.entity";

export interface IListCollectionsParams {
  searchTitle?: string;
  limit: number;
}

export interface ICollectionsResponse {
  collections: ICollection[];
}

export interface ICollectionResponse {
  collection: ICollection;
}

export interface ICollectionService {
  listCollections(params: IListCollectionsParams): Promise<ICollectionsResponse>;
  updateCollection(input: UpdateCollectionInput): Promise<ICollectionResponse>;
}
