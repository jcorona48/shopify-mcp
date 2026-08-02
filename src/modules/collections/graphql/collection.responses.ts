import type { UserError } from "@/shared/errors";
import type { ICollectionNode } from "@/modules/collections/graphql/collection.nodes";

export interface ICollectionConnection {
  edges: Array<{ node: ICollectionNode }>;
}

export interface ICollectionMutationPayload {
  collection?: ICollectionNode | null;
  userErrors: UserError[];
}

export interface IListCollectionsResponse {
  collections: ICollectionConnection;
}

export interface IUpdateCollectionResponse {
  collectionUpdate?: ICollectionMutationPayload | null;
}
