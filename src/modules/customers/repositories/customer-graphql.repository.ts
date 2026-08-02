import { ShopifyGraphQLClient } from "@/shared/graphql-client";
import { gidFor } from "@/shared/gid";
import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";
import type { ICustomer } from "@/modules/customers/entities/customer.entity";
import type {
  ICustomerOrdersResponse,
  ICustomersResponse,
  IGetCustomerOrdersParams,
  IListCustomersParams,
} from "@/modules/customers/interfaces/customer-service.interface";
import type { ICustomerRepository } from "@/modules/customers/repositories/customer.repository";
import { toCustomer, toCustomerOrder } from "@/modules/customers/graphql/customer.mappers";
import { toUpdateCustomerInput } from "@/modules/customers/graphql/customer.inputs";
import {
  IGetCustomerOrdersResponse,
  IListCustomersResponse,
  IUpdateCustomerResponse,
} from "@/modules/customers/graphql/customer.responses";
import { GET_CUSTOMERS_QUERY } from "@/modules/customers/graphql/get-customers.query";
import { GET_CUSTOMER_ORDERS_QUERY } from "@/modules/customers/graphql/get-customer-orders.query";
import { UPDATE_CUSTOMER_QUERY } from "@/modules/customers/graphql/update-customer.query";

export class CustomerGraphQLRepository implements ICustomerRepository {
  constructor(private readonly shopify: ShopifyGraphQLClient) {}

  async listCustomers(params: IListCustomersParams): Promise<ICustomersResponse> {
    const data = await this.shopify.request<IListCustomersResponse>(
      GET_CUSTOMERS_QUERY,
      {
        first: params.limit,
        query: params.searchQuery || undefined,
      },
    );

    return {
      customers: data.customers.edges.map((edge) => toCustomer(edge.node)),
    };
  }

  async getCustomerWithOrders(
    params: IGetCustomerOrdersParams,
  ): Promise<ICustomerOrdersResponse | null> {
    const data = await this.shopify.request<IGetCustomerOrdersResponse>(
      GET_CUSTOMER_ORDERS_QUERY,
      {
        customerId: gidFor("Customer", params.customerId),
        first: params.limit,
      },
    );

    if (!data.customer) return null;

    return {
      customer: toCustomer(data.customer),
      orders: (data.customer.orders?.edges ?? []).map((edge) =>
        toCustomerOrder(edge.node),
      ),
    };
  }

  async updateCustomer(input: UpdateCustomerInput): Promise<ICustomer | null> {
    const data = await this.shopify.requestMutation<IUpdateCustomerResponse>(
      UPDATE_CUSTOMER_QUERY,
      {
        input: toUpdateCustomerInput(input),
      },
    );

    const payload = data.customerUpdate;
    if (!payload?.customer) return null;

    return toCustomer(payload.customer);
  }
}
