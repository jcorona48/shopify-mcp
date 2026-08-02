import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { GetProductsInputSchema } from "@/modules/products/dto/get-products.dto";
import type { GetProductsInput } from "@/modules/products/dto/get-products.dto";

export class GetProductsController implements Tool {
  readonly name = "get-products";
  readonly description = "Get all products or search by title";
  readonly inputSchema = GetProductsInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { searchTitle, limit } = input as GetProductsInput;
    return this.service.listProducts({ searchTitle, limit });
  }
}
