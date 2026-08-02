import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { UpdateProductInputSchema } from "@/modules/products/dto/update-product.dto";
import type { UpdateProductInput } from "@/modules/products/dto/update-product.dto";

export class UpdateProductController implements Tool {
  readonly name = "update-product";
  readonly description =
    "Update an existing product's fields (title, description, status, tags, etc.)";
  readonly inputSchema = UpdateProductInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.updateProduct(input as UpdateProductInput);
  }
}
