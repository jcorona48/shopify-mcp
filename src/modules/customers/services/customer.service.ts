import { ShopifyNotFoundError } from "@/shared/errors";
import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";
import type {
  ICustomerOrdersResponse,
  ICustomerResponse,
  ICustomersResponse,
  IGetCustomerOrdersParams,
  IListCustomersParams,
  ICustomerService,
} from "@/modules/customers/interfaces/customer-service.interface";
import type { ICustomerRepository } from "@/modules/customers/repositories/customer.repository";

export class CustomerService implements ICustomerService {
  constructor(private readonly repository: ICustomerRepository) {}

  async listCustomers(params: IListCustomersParams): Promise<ICustomersResponse> {
    return this.repository.listCustomers(params);
  }

  async getCustomerOrders(
    params: IGetCustomerOrdersParams,
  ): Promise<ICustomerOrdersResponse> {
    const result = await this.repository.getCustomerWithOrders(params);
    if (!result) {
      throw new ShopifyNotFoundError("Customer", params.customerId);
    }
    return result;
  }

  async updateCustomer(input: UpdateCustomerInput): Promise<ICustomerResponse> {
    const customer = await this.repository.updateCustomer(input);
    if (!customer) {
      throw new ShopifyNotFoundError("Customer", input.id);
    }
    return { customer };
  }
}
