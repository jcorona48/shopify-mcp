import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";
import type { ICustomer } from "@/modules/customers/entities/customer.entity";
import type {
  ICustomerOrdersResponse,
  ICustomersResponse,
  IGetCustomerOrdersParams,
  IListCustomersParams,
} from "@/modules/customers/interfaces/customer-service.interface";

export interface ICustomerRepository {
  listCustomers(params: IListCustomersParams): Promise<ICustomersResponse>;
  getCustomerWithOrders(
    params: IGetCustomerOrdersParams,
  ): Promise<ICustomerOrdersResponse | null>;
  updateCustomer(input: UpdateCustomerInput): Promise<ICustomer | null>;
}
