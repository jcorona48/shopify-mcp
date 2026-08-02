import type { IProductService } from "@/modules/products/interfaces/product-service.interface";
import type { Tool } from "@/shared/tool";
import { ManageProductOptionsInputSchema } from "@/modules/products/dto/manage-product-options.dto";
import type { ManageProductOptionsInput } from "@/modules/products/dto/manage-product-options.dto";

export class ManageProductOptionsController implements Tool {
  readonly name = "manage-product-options";
  readonly description =
    "Create, update or delete product options. Use action=create with options array, action=update with optionId + fields, or action=delete with optionIds.";
  readonly inputSchema = ManageProductOptionsInputSchema;

  constructor(private readonly service: IProductService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.manageOptions(input as ManageProductOptionsInput);
  }
}
