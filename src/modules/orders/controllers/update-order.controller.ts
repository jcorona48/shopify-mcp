import type { IOrderService } from "@/modules/orders/interfaces/order-service.interface";
import type { Tool } from "@/shared/tool";
import { UpdateOrderInputSchema } from "@/modules/orders/dto/update-order.dto";
import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";

export class UpdateOrderController implements Tool {
  readonly name = "update-order";
  readonly description =
    "Update an order's attributes (email, note, tags, custom attributes, shipping address, metafields)";
  readonly inputSchema = UpdateOrderInputSchema;

  constructor(private readonly service: IOrderService) {}

  async execute(input: Record<string, unknown>): Promise<unknown> {
    return this.service.updateOrder(input as UpdateOrderInput);
  }
}
