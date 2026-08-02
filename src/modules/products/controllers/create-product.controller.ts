import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { CreateProductInputSchema } from "@/modules/products/dto/create-product.dto";
import type { CreateProductInput } from "@/modules/products/dto/create-product.dto";

export class CreateProductController implements Tool {
  readonly name = "create-product";
  readonly description =
    "Create a new product. When using productOptions, Shopify registers all option values but only creates one default variant (first value of each option, price $0). Use manage-product-variants with strategy=REMOVE_STANDALONE_VARIANT afterward to create all real variants with prices.";
  readonly inputSchema = CreateProductInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.createProduct(input as CreateProductInput);
  }
}
