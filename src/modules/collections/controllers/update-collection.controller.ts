import type { ICollectionService } from "@/modules/collections/interfaces/collection-service.interface";
import type { Tool } from "@/shared/tool";
import { UpdateCollectionInputSchema } from "@/modules/collections/dto/update-collection.dto";
import type { UpdateCollectionInput } from "@/modules/collections/dto/update-collection.dto";

export class UpdateCollectionController implements Tool {
  readonly name = "update-collection";
  readonly description =
    "Update a collection's title, description or SEO settings";
  readonly inputSchema = UpdateCollectionInputSchema;

  constructor(private readonly service: ICollectionService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.updateCollection(input as UpdateCollectionInput);
  }
}
