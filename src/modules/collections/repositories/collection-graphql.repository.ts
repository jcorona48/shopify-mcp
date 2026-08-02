import { ShopifyGraphQLClient } from "@/shared/graphql-client";
import { gidFor } from "@/shared/gid";
import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";
import type { ICollection } from "@/modules/collections/entities/collection.entity";
import type {
  ICollectionsResponse,
  IListCollectionsParams,
} from "@/modules/collections/interfaces/collection-service.interface";
import type { ICollectionRepository } from "@/modules/collections/repositories/collection.repository";
import { toCollection } from "@/modules/collections/graphql/collection.mappers";
import { toUpdateCollectionInput } from "@/modules/collections/graphql/collection.inputs";
import {
  IListCollectionsResponse,
  IUpdateCollectionResponse,
} from "@/modules/collections/graphql/collection.responses";
import { GET_COLLECTIONS_QUERY } from "@/modules/collections/graphql/get-collections.query";
import { UPDATE_COLLECTION_QUERY } from "@/modules/collections/graphql/update-collection.query";

export class CollectionGraphQLRepository implements ICollectionRepository {
  constructor(private readonly shopify: ShopifyGraphQLClient) {}

  async listCollections(
    params: IListCollectionsParams,
  ): Promise<ICollectionsResponse> {
    const data = await this.shopify.request<IListCollectionsResponse>(
      GET_COLLECTIONS_QUERY,
      {
        first: params.limit,
        query: params.searchTitle ? `title:${params.searchTitle}` : undefined,
      },
    );

    return {
      collections: data.collections.edges.map((edge) => toCollection(edge.node)),
    };
  }

  async updateCollection(input: UpdateCollectionInput): Promise<ICollection | null> {
    const data = await this.shopify.requestMutation<IUpdateCollectionResponse>(
      UPDATE_COLLECTION_QUERY,
      {
        input: toUpdateCollectionInput(input),
      },
    );

    const payload = data.collectionUpdate;
    if (!payload?.collection) return null;

    return toCollection(payload.collection);
  }
}
