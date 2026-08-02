import type { Tool } from "@/shared/tool";
import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import { ProductService } from "@/modules/products/services/product.service";
import { ProductGraphQLRepository } from "@/modules/products/repositories/product-graphql.repository";
import { GetProductsController } from "@/modules/products/controllers/get-products.controller";
import { GetProductByIdController } from "@/modules/products/controllers/get-product-by-id.controller";
import { CreateProductController } from "@/modules/products/controllers/create-product.controller";
import { UpdateProductController } from "@/modules/products/controllers/update-product.controller";
import { DeleteProductController } from "@/modules/products/controllers/delete-product.controller";
import { ManageProductVariantsController } from "@/modules/products/controllers/manage-product-variants.controller";
import { DeleteProductVariantsController } from "@/modules/products/controllers/delete-product-variants.controller";
import { ManageProductOptionsController } from "@/modules/products/controllers/manage-product-options.controller";

export { ProductService } from "@/modules/products/services/product.service";
export { ProductGraphQLRepository } from "@/modules/products/repositories/product-graphql.repository";
export type { IProductService } from "@/modules/products/interfaces/product-service.interface";
export type { IProductRepository } from "@/modules/products/repositories/product.repository";

export function createProductTools(service: IProductService): Tool[] {
  return [
    new GetProductsController(service),
    new GetProductByIdController(service),
    new CreateProductController(service),
    new UpdateProductController(service),
    new DeleteProductController(service),
    new ManageProductVariantsController(service),
    new DeleteProductVariantsController(service),
    new ManageProductOptionsController(service),
  ];
}
