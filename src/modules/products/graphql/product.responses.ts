import type { UserError } from "@/shared/errors";
import type {
  IProductNode,
  IVariantNode,
} from "@/modules/products/graphql/product.nodes";

export interface IProductConnection {
  edges: Array<{ node: IProductNode }>;
}

export interface IProductMutationPayload {
  product?: IProductNode | null;
  userErrors: UserError[];
}

export interface IVariantBulkPayload {
  productVariants?: IVariantNode[] | null;
  userErrors: UserError[];
}

export interface IDeleteProductPayload {
  deletedProductId?: string | null;
  userErrors: UserError[];
}

export interface IVariantBulkDeletePayload {
  product?: IProductNode | null;
  userErrors: UserError[];
}

export interface IListProductsResponse {
  products: IProductConnection;
}

export interface IGetProductByIdResponse {
  product?: IProductNode | null;
}

export interface ICreateProductResponse {
  productCreate?: IProductMutationPayload | null;
}

export interface IUpdateProductResponse {
  productUpdate?: IProductMutationPayload | null;
}

export interface IDeleteProductResponse {
  productDelete?: IDeleteProductPayload | null;
}

export interface IVariantBulkCreateResponse {
  productVariantsBulkCreate?: IVariantBulkPayload | null;
}

export interface IVariantBulkUpdateResponse {
  productVariantsBulkUpdate?: IVariantBulkPayload | null;
}

export interface IVariantBulkDeleteResponse {
  productVariantsBulkDelete?: IVariantBulkDeletePayload | null;
}

export interface IProductOptionsCreateResponse {
  productOptionsCreate?: IProductMutationPayload | null;
}

export interface IProductOptionUpdateResponse {
  productOptionUpdate?: IProductMutationPayload | null;
}

export interface IProductOptionsDeleteResponse {
  productOptionsDelete?: IProductMutationPayload | null;
}
