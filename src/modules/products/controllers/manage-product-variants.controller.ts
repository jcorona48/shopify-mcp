import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { ManageProductVariantsInputSchema } from "@/modules/products/dto/manage-product-variants.dto";
import type { ManageProductVariantsInput } from "@/modules/products/dto/manage-product-variants.dto";

export class ManageProductVariantsController implements Tool {
  readonly name = "manage-product-variants";
  readonly description =
    "Create or update product variants. Omit variant id to create new, include id to update existing.";
  readonly inputSchema = ManageProductVariantsInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.manageVariants(input as ManageProductVariantsInput);
  }
}
