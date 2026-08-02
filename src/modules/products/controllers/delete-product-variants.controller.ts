import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { DeleteProductVariantsInputSchema } from "@/modules/products/dto/delete-product-variants.dto";
import type { DeleteProductVariantsInput } from "@/modules/products/dto/delete-product-variants.dto";

export class DeleteProductVariantsController implements Tool {
  readonly name = "delete-product-variants";
  readonly description = "Delete one or more variants from a product";
  readonly inputSchema = DeleteProductVariantsInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.deleteVariants(input as DeleteProductVariantsInput);
  }
}
