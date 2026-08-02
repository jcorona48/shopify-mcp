import { ShopifyGraphQLClient } from "@/shared/graphql-client";
import { gidFor } from "@/shared/gid";
import type { IProduct } from "@/modules/products/entities/product.entity";
import type {
  IProductVariant,
  IProductWithRemainingVariants,
} from "@/modules/products/entities/product-variant.entity";
import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";
import type {
  IProductRepository,
  ProductOptionInput,
  ProductOptionUpdateInput,
  VariantStrategy,
} from "@/modules/products/repositories/product.repository";
import type { IListProductsParams } from "@/modules/products/interfaces/product-service.interface";
import {
  toCreateInput,
  toUpdateInput,
  toVariantInput,
} from "@/modules/products/graphql/product.inputs";
import type { IVariantInput } from "@/modules/products/graphql/product.inputs";
import { toProduct, toVariant } from "@/modules/products/graphql/product.mappers";
import {
  ICreateProductResponse,
  IDeleteProductResponse,
  IGetProductByIdResponse,
  IListProductsResponse,
  IProductOptionUpdateResponse,
  IProductOptionsCreateResponse,
  IProductOptionsDeleteResponse,
  IUpdateProductResponse,
  IVariantBulkCreateResponse,
  IVariantBulkDeleteResponse,
  IVariantBulkUpdateResponse,
} from "@/modules/products/graphql/product.responses";
import { GET_PRODUCTS_QUERY } from "@/modules/products/graphql/get-products.query";
import { GET_PRODUCT_BY_ID_QUERY } from "@/modules/products/graphql/get-product-by-id.query";
import { CREATE_PRODUCT_QUERY } from "@/modules/products/graphql/create-product.query";
import { UPDATE_PRODUCT_QUERY } from "@/modules/products/graphql/update-product.query";
import { DELETE_PRODUCT_QUERY } from "@/modules/products/graphql/delete-product.query";
import {
  PRODUCT_VARIANTS_BULK_CREATE_QUERY,
  PRODUCT_VARIANTS_BULK_UPDATE_QUERY,
} from "@/modules/products/graphql/manage-product-variants.query";
import { PRODUCT_VARIANTS_BULK_DELETE_QUERY } from "@/modules/products/graphql/delete-product-variants.query";
import {
  PRODUCT_OPTIONS_CREATE_QUERY,
  PRODUCT_OPTION_UPDATE_QUERY,
  PRODUCT_OPTIONS_DELETE_QUERY,
} from "@/modules/products/graphql/manage-product-options.query";

export class ProductGraphQLRepository implements IProductRepository {
  constructor(private readonly shopify: ShopifyGraphQLClient) {}

  async listProducts(
    params: IListProductsParams,
  ): Promise<{ products: IProduct[] }> {
    const data = await this.shopify.request<IListProductsResponse>(
      GET_PRODUCTS_QUERY,
      {
        first: params.limit,
        query: params.searchTitle ? `title:${params.searchTitle}` : undefined,
      },
    );

    return { products: data.products.edges.map((edge) => toProduct(edge.node)) };
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    const data = await this.shopify.request<IGetProductByIdResponse>(
      GET_PRODUCT_BY_ID_QUERY,
      {
        id: gidFor("Product", productId),
      },
    );

    return data.product ? toProduct(data.product) : null;
  }

  async createProduct(input: CreateProductInput): Promise<IProduct> {
    const data = await this.shopify.requestMutation<ICreateProductResponse>(
      CREATE_PRODUCT_QUERY,
      { product: toCreateInput(input) },
    );

    return toProduct(data.productCreate!.product!);
  }

  async updateProduct(input: UpdateProductInput): Promise<IProduct> {
    const data = await this.shopify.requestMutation<IUpdateProductResponse>(
      UPDATE_PRODUCT_QUERY,
      { product: toUpdateInput(input) },
    );

    return toProduct(data.productUpdate!.product!);
  }

  async deleteProduct(id: string): Promise<string | null> {
    const data = await this.shopify.requestMutation<IDeleteProductResponse>(
      DELETE_PRODUCT_QUERY,
      {
        input: { id: gidFor("Product", id) },
      },
    );

    return data.productDelete?.deletedProductId ?? null;
  }

  async createVariants(
    productId: string,
    variants: IVariantInput[],
    strategy?: VariantStrategy,
  ): Promise<IProductVariant[]> {
    const data = await this.shopify.requestMutation<IVariantBulkCreateResponse>(
      PRODUCT_VARIANTS_BULK_CREATE_QUERY,
      {
        productId: gidFor("Product", productId),
        variants: variants.map((v) => toVariantInput(v)),
        strategy,
      },
    );

    return (data.productVariantsBulkCreate?.productVariants ?? []).map(
      (node) => toVariant(node),
    );
  }

  async updateVariants(
    productId: string,
    variants: IVariantInput[],
  ): Promise<IProductVariant[]> {
    const data = await this.shopify.requestMutation<IVariantBulkUpdateResponse>(
      PRODUCT_VARIANTS_BULK_UPDATE_QUERY,
      {
        productId: gidFor("Product", productId),
        variants: variants.map((v) => toVariantInput(v)),
      },
    );

    return (data.productVariantsBulkUpdate?.productVariants ?? []).map(
      (node) => toVariant(node),
    );
  }

  async deleteVariants(
    productId: string,
    variantIds: string[],
  ): Promise<IProductWithRemainingVariants | null> {
    const data = await this.shopify.requestMutation<IVariantBulkDeleteResponse>(
      PRODUCT_VARIANTS_BULK_DELETE_QUERY,
      {
        productId: gidFor("Product", productId),
        variantsIds: variantIds.map((id) => gidFor("ProductVariant", id)),
      },
    );

    const product = data.productVariantsBulkDelete?.product;
    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      remainingVariants: (product.variants?.edges ?? []).map((edge) =>
        toVariant(edge.node),
      ),
    };
  }

  async createOptions(
    productId: string,
    options: ProductOptionInput[],
  ): Promise<IProduct | null> {
    const data = await this.shopify.requestMutation<IProductOptionsCreateResponse>(
      PRODUCT_OPTIONS_CREATE_QUERY,
      {
        productId: gidFor("Product", productId),
        options: options.map((option) => ({
          name: option.name,
          position: option.position,
          values: (option.values ?? []).map((value) => ({ name: value })),
        })),
      },
    );

    const productNode = data.productOptionsCreate?.product;
    return productNode ? toProduct(productNode) : null;
  }

  async updateOption(
    productId: string,
    option: ProductOptionUpdateInput,
    valuesToAdd: string[],
    valuesToDelete: string[],
  ): Promise<IProduct | null> {
    const data = await this.shopify.requestMutation<IProductOptionUpdateResponse>(
      PRODUCT_OPTION_UPDATE_QUERY,
      {
        productId: gidFor("Product", productId),
        option: {
          id: option.id,
          name: option.name,
          position: option.position,
        },
        optionValuesToAdd: valuesToAdd.map((value) => ({ name: value })),
        optionValuesToDelete: valuesToDelete,
      },
    );

    const productNode = data.productOptionUpdate?.product;
    return productNode ? toProduct(productNode) : null;
  }

  async deleteOptions(
    productId: string,
    optionIds: string[],
  ): Promise<IProduct | null> {
    const data = await this.shopify.requestMutation<IProductOptionsDeleteResponse>(
      PRODUCT_OPTIONS_DELETE_QUERY,
      {
        productId: gidFor("Product", productId),
        options: optionIds,
      },
    );

    const productNode = data.productOptionsDelete?.product;
    return productNode ? toProduct(productNode) : null;
  }
}
