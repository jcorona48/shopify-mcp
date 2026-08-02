import type { Tool } from "@/shared/tool";
import type { IOrderService } from "@/modules/orders/interfaces/order-service.interface";
import { OrderService } from "@/modules/orders/services/order.service";
import { OrderGraphQLRepository } from "@/modules/orders/repositories/order-graphql.repository";
import { GetOrdersController } from "@/modules/orders/controllers/get-orders.controller";
import { GetOrderByIdController } from "@/modules/orders/controllers/get-order-by-id.controller";
import { UpdateOrderController } from "@/modules/orders/controllers/update-order.controller";

export { OrderService } from "@/modules/orders/services/order.service";
export { OrderGraphQLRepository } from "@/modules/orders/repositories/order-graphql.repository";
export type { IOrderService } from "@/modules/orders/interfaces/order-service.interface";
export type { IOrderRepository } from "@/modules/orders/repositories/order.repository";

export function createOrderTools(service: IOrderService): Tool[] {
  return [
    new GetOrdersController(service),
    new GetOrderByIdController(service),
    new UpdateOrderController(service),
  ];
}
