import { ShopifyNotFoundError } from "@/shared/errors";
import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";
import type {
  IListOrdersParams,
  IOrderResponse,
  IOrdersResponse,
  IOrderService,
} from "@/modules/orders/interfaces/order-service.interface";
import type { IOrderRepository } from "@/modules/orders/repositories/order.repository";

export class OrderService implements IOrderService {
  constructor(private readonly repository: IOrderRepository) {}

  async listOrders(params: IListOrdersParams): Promise<IOrdersResponse> {
    return this.repository.listOrders(params);
  }

  async getOrderById(orderId: string): Promise<IOrderResponse> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) {
      throw new ShopifyNotFoundError("Order", orderId);
    }
    return { order };
  }

  async updateOrder(input: UpdateOrderInput): Promise<IOrderResponse> {
    const order = await this.repository.updateOrder(input);
    if (!order) {
      throw new ShopifyNotFoundError("Order", input.id);
    }
    return { order };
  }
}
