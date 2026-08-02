import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";
import type { DeleteProductVariantsInput } from "@/modules/products/dto/delete-product-variants.dto";
import type { ManageProductOptionsInput } from "@/modules/products/dto/manage-product-options.dto";
import type { ManageProductVariantsInput } from "@/modules/products/dto/manage-product-variants.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";
import type { IProduct } from "@/modules/products/entities/product.entity";
import type {
  IProductWithRemainingVariants,
  IVariantChangeResult,
} from "@/modules/products/entities/product-variant.entity";

export interface ListResponse {
  products: IProduct[];
}

export interface ProductResponse {
  product: IProduct;
}

export interface DeleteProductResponse {
  deletedProductId: string | null;
}

export interface ProductWithRemainingVariantsResponse {
  product: IProductWithRemainingVariants;
}

export interface IListProductsParams {
  searchTitle?: string;
  limit: number;
}

export interface IProductService {
  listProducts(params: IListProductsParams): Promise<ListResponse>;
  getProductById(productId: string): Promise<ProductResponse>;
  createProduct(input: CreateProductInput): Promise<ProductResponse>;
  updateProduct(input: UpdateProductInput): Promise<ProductResponse>;
  deleteProduct(id: string): Promise<DeleteProductResponse>;
  manageVariants(input: ManageProductVariantsInput): Promise<IVariantChangeResult>;
  deleteVariants(
    input: DeleteProductVariantsInput,
  ): Promise<ProductWithRemainingVariantsResponse>;
  manageOptions(input: ManageProductOptionsInput): Promise<ProductResponse>;
}
