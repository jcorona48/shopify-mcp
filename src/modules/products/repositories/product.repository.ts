import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";
import type { IProduct } from "@/modules/products/entities/product.entity";
import type {
  IProductVariant,
  IProductWithRemainingVariants,
} from "@/modules/products/entities/product-variant.entity";
import type { IVariantInput } from "@/modules/products/graphql/product.inputs";
import type {
  IListProductsParams,
  ListResponse,
} from "@/modules/products/interfaces/product-service.interface";

export type VariantStrategy =
  | "DEFAULT"
  | "REMOVE_STANDALONE_VARIANT"
  | "PRESERVE_STANDALONE_VARIANT";

export interface ProductOptionInput {
  name: string;
  position?: number;
  values?: string[];
}

export interface ProductOptionUpdateInput {
  id: string;
  name?: string;
  position?: number;
}

export interface IProductRepository {
  listProducts(params: IListProductsParams): Promise<ListResponse>;
  getProductById(productId: string): Promise<IProduct | null>;
  createProduct(input: CreateProductInput): Promise<IProduct>;
  updateProduct(input: UpdateProductInput): Promise<IProduct>;
  deleteProduct(id: string): Promise<string | null>;
  createVariants(
    productId: string,
    variants: IVariantInput[],
    strategy?: VariantStrategy,
  ): Promise<IProductVariant[]>;
  updateVariants(
    productId: string,
    variants: IVariantInput[],
  ): Promise<IProductVariant[]>;
  deleteVariants(
    productId: string,
    variantIds: string[],
  ): Promise<IProductWithRemainingVariants | null>;
  createOptions(
    productId: string,
    options: ProductOptionInput[],
  ): Promise<IProduct | null>;
  updateOption(
    productId: string,
    option: ProductOptionUpdateInput,
    valuesToAdd: string[],
    valuesToDelete: string[],
  ): Promise<IProduct | null>;
  deleteOptions(productId: string, optionIds: string[]): Promise<IProduct | null>;
}
