import type { ICustomerService } from "@/modules/customers/interfaces/customer-service.interface";
import type { Tool } from "@/shared/tool";
import { GetCustomersInputSchema } from "@/modules/customers/dto/get-customers.dto";
import type { GetCustomersInput } from "@/modules/customers/dto/get-customers.dto";

export class GetCustomersController implements Tool {
  readonly name = "get-customers";
  readonly description = "Get a list of customers, optionally filtered by search query";
  readonly inputSchema = GetCustomersInputSchema;

  constructor(private readonly service: ICustomerService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { searchQuery, limit } = input as GetCustomersInput;
    return this.service.listCustomers({ searchQuery, limit });
  }
}
