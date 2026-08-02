import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";
import type { IOrder } from "@/modules/orders/entities/order.entity";
import type {
  IListOrdersParams,
  IOrdersResponse,
} from "@/modules/orders/interfaces/order-service.interface";

export interface IOrderRepository {
  listOrders(params: IListOrdersParams): Promise<IOrdersResponse>;
  getOrderById(orderId: string): Promise<IOrder | null>;
  updateOrder(input: UpdateOrderInput): Promise<IOrder | null>;
}
