import { ShopifyGraphQLClient } from "@/shared/graphql-client";
import { gidFor } from "@/shared/gid";
import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";
import type { IOrder } from "@/modules/orders/entities/order.entity";
import type {
  IListOrdersParams,
  IOrderStatusFilter,
  IOrdersResponse,
} from "@/modules/orders/interfaces/order-service.interface";
import type { IOrderRepository } from "@/modules/orders/repositories/order.repository";
import { toOrder } from "@/modules/orders/graphql/order.mappers";
import { toUpdateOrderInput } from "@/modules/orders/graphql/order.inputs";
import {
  IGetOrderByIdResponse,
  IListOrdersResponse,
  IUpdateOrderResponse,
} from "@/modules/orders/graphql/order.responses";
import { GET_ORDERS_QUERY } from "@/modules/orders/graphql/get-orders.query";
import { GET_ORDER_BY_ID_QUERY } from "@/modules/orders/graphql/get-order-by-id.query";
import { UPDATE_ORDER_QUERY } from "@/modules/orders/graphql/update-order.query";

const STATUS_QUERY: Record<Exclude<IOrderStatusFilter, "any">, string> = {
  open: "status:open",
  closed: "status:closed",
  cancelled: "status:cancelled",
};

export class OrderGraphQLRepository implements IOrderRepository {
  constructor(private readonly shopify: ShopifyGraphQLClient) {}

  async listOrders(params: IListOrdersParams): Promise<IOrdersResponse> {
    const data = await this.shopify.request<IListOrdersResponse>(GET_ORDERS_QUERY, {
      first: params.limit,
      query: params.status === "any" ? undefined : STATUS_QUERY[params.status],
    });

    return { orders: data.orders.edges.map((edge) => toOrder(edge.node)) };
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    const data = await this.shopify.request<IGetOrderByIdResponse>(
      GET_ORDER_BY_ID_QUERY,
      {
        id: gidFor("Order", orderId),
      },
    );

    return data.order ? toOrder(data.order) : null;
  }

  async updateOrder(input: UpdateOrderInput): Promise<IOrder | null> {
    const data = await this.shopify.requestMutation<IUpdateOrderResponse>(
      UPDATE_ORDER_QUERY,
      {
        input: toUpdateOrderInput(input),
      },
    );

    const payload = data.orderUpdate;
    if (!payload?.order) return null;

    return toOrder(payload.order);
  }
}
