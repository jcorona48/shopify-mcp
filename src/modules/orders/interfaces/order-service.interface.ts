import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";
import type { IOrder } from "@/modules/orders/entities/order.entity";

export type IOrderStatusFilter = "any" | "open" | "closed" | "cancelled";

export interface IListOrdersParams {
  status: IOrderStatusFilter;
  limit: number;
}

export interface IOrdersResponse {
  orders: IOrder[];
}

export interface IOrderResponse {
  order: IOrder;
}

export interface IOrderService {
  listOrders(params: IListOrdersParams): Promise<IOrdersResponse>;
  getOrderById(orderId: string): Promise<IOrderResponse>;
  updateOrder(input: UpdateOrderInput): Promise<IOrderResponse>;
}
