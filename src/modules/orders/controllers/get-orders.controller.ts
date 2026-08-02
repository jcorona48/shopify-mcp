import type { IOrderService } from "@/modules/orders/interfaces/order-service.interface";
import type { Tool } from "@/shared/tool";
import { GetOrdersInputSchema } from "@/modules/orders/dto/get-orders.dto";
import type { GetOrdersInput } from "@/modules/orders/dto/get-orders.dto";

export class GetOrdersController implements Tool {
  readonly name = "get-orders";
  readonly description = "Get a list of orders, optionally filtered by status";
  readonly inputSchema = GetOrdersInputSchema;

  constructor(private readonly service: IOrderService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { status, limit } = input as GetOrdersInput;
    return this.service.listOrders({ status, limit });
  }
}
