import type { ICollectionService } from "@/modules/collections/interfaces/collection-service.interface";
import type { Tool } from "@/shared/tool";
import { GetCollectionsInputSchema } from "@/modules/collections/dto/get-collections.dto";
import type { GetCollectionsInput } from "@/modules/collections/dto/get-collections.dto";

export class GetCollectionsController implements Tool {
  readonly name = "get-collections";
  readonly description = "Get a list of collections, optionally filtered by title";
  readonly inputSchema = GetCollectionsInputSchema;

  constructor(private readonly service: ICollectionService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { searchTitle, limit } = input as GetCollectionsInput;
    return this.service.listCollections({ searchTitle, limit });
  }
}
