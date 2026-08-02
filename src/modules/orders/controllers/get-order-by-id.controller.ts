import type { IOrderService } from "@/modules/orders/interfaces/order-service.interface";
import type { Tool } from "@/shared/tool";
import { GetOrderByIdInputSchema } from "@/modules/orders/dto/get-order-by-id.dto";
import type { GetOrderByIdInput } from "@/modules/orders/dto/get-order-by-id.dto";

export class GetOrderByIdController implements Tool {
  readonly name = "get-order-by-id";
  readonly description = "Get a specific order by ID";
  readonly inputSchema = GetOrderByIdInputSchema;

  constructor(private readonly service: IOrderService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    const { orderId } = input as GetOrderByIdInput;
    return this.service.getOrderById(orderId);
  }
}
