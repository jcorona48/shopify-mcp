/**
 * Contract between the products module's tools and their application logic.
 *
 * Tools depend only on the {@link IProductService} interface (DIP);
 * {@link ProductService} is the concrete service that tools receive. It owns
 * business/orchestration logic and delegates data access to an injected
 * {@link IProductRepository}, so the data source (GraphQL today) stays
 * swappable for tests or other transports.
 */

import { ShopifyNotFoundError } from "@/shared/errors";
import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";
import type { DeleteProductVariantsInput } from "@/modules/products/dto/delete-product-variants.dto";
import type { ManageProductOptionsInput } from "@/modules/products/dto/manage-product-options.dto";
import type { ManageProductVariantsInput } from "@/modules/products/dto/manage-product-variants.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";
import type {
  DeleteProductResponse,
  IListProductsParams,
  IProductService,
  ListResponse,
  ProductResponse,
  ProductWithRemainingVariantsResponse,
} from "@/modules/products/interfaces/product-service.interface";
import type {
  IProductWithRemainingVariants,
  IVariantChangeResult,
} from "@/modules/products/entities/product-variant.entity";
import type { IProduct } from "@/modules/products/entities/product.entity";
import type { IProductRepository } from "@/modules/products/repositories/product.repository";

export class ProductService implements IProductService {
  constructor(private readonly repository: IProductRepository) {}

  async listProducts(params: IListProductsParams): Promise<ListResponse> {
    return this.repository.listProducts(params);
  }

  async getProductById(productId: string): Promise<ProductResponse> {
    const product = await this.repository.getProductById(productId);
    if (!product) {
      throw new ShopifyNotFoundError("Product", productId);
    }
    return { product };
  }

  async createProduct(input: CreateProductInput): Promise<ProductResponse> {
    return { product: await this.repository.createProduct(input) };
  }

  async updateProduct(input: UpdateProductInput): Promise<ProductResponse> {
    return { product: await this.repository.updateProduct(input) };
  }

  async deleteProduct(id: string): Promise<DeleteProductResponse> {
    return { deletedProductId: await this.repository.deleteProduct(id) };
  }

  async manageVariants(input: ManageProductVariantsInput): Promise<IVariantChangeResult> {
    const result: IVariantChangeResult = { created: [], updated: [] };

    const toCreate = input.variants.filter((v) => !v.id);
    const toUpdate = input.variants.filter((v) => v.id);

    if (toCreate.length > 0) {
      result.created = await this.repository.createVariants(
        input.productId,
        toCreate,
        input.strategy,
      );
    }

    if (toUpdate.length > 0) {
      result.updated = await this.repository.updateVariants(
        input.productId,
        toUpdate,
      );
    }

    return result;
  }

  async deleteVariants(
    input: DeleteProductVariantsInput,
  ): Promise<ProductWithRemainingVariantsResponse> {
    const product = await this.repository.deleteVariants(
      input.productId,
      input.variantIds,
    );
    if (!product) {
      throw new ShopifyNotFoundError("Product", input.productId);
    }
    return { product };
  }

  async manageOptions(input: ManageProductOptionsInput): Promise<ProductResponse> {
    let product: IProduct | null = null;

    if (input.action === "create") {
      product = await this.repository.createOptions(input.productId, input.options ?? []);
    } else if (input.action === "update") {
      product = await this.repository.updateOption(
        input.productId,
        { id: input.optionId ?? "", name: input.name, position: input.position },
        input.valuesToAdd ?? [],
        input.valuesToDelete ?? [],
      );
    } else {
      product = await this.repository.deleteOptions(input.productId, input.optionIds ?? []);
    }

    if (!product) {
      throw new ShopifyNotFoundError("Product", input.productId);
    }

    return { product };
  }
}
