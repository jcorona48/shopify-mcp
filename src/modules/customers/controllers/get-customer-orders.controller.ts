import type { ICustomerService } from "@/modules/customers/interfaces/customer-service.interface";
import type { Tool } from "@/shared/tool";
import { GetCustomerOrdersInputSchema } from "@/modules/customers/dto/get-customer-orders.dto";
import type { GetCustomerOrdersInput } from "@/modules/customers/dto/get-customer-orders.dto";

export class GetCustomerOrdersController implements Tool {
  readonly name = "get-customer-orders";
  readonly description = "Get all orders for a customer by customer ID";
  readonly inputSchema = GetCustomerOrdersInputSchema;

  constructor(private readonly service: ICustomerService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { customerId, limit } = input as GetCustomerOrdersInput;
    return this.service.getCustomerOrders({ customerId, limit });
  }
}
