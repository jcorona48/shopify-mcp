import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { GetProductByIdInputSchema } from "@/modules/products/dto/get-product-by-id.dto";
import type { GetProductByIdInput } from "@/modules/products/dto/get-product-by-id.dto";

export class GetProductByIdController implements Tool {
  readonly name = "get-product-by-id";
  readonly description = "Get a single product by ID";
  readonly inputSchema = GetProductByIdInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { productId } = input as GetProductByIdInput;
    return this.service.getProductById(productId);
  }
}
