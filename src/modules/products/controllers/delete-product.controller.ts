import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { DeleteProductInputSchema } from "@/modules/products/dto/delete-product.dto";
import type { DeleteProductInput } from "@/modules/products/dto/delete-product.dto";

export class DeleteProductController implements Tool {
  readonly name = "delete-product";
  readonly description = "Delete a product";
  readonly inputSchema = DeleteProductInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { id } = input as DeleteProductInput;
    return this.service.deleteProduct(id);
  }
}
