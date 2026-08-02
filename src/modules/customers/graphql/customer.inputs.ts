import { gidFor } from "@/shared/gid";
import type { UpdateCustomerInput } from "@/modules/customers/dto/update-customer.dto";

export function toUpdateCustomerInput(input: UpdateCustomerInput) {
  return {
    id: gidFor("Customer", input.id),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    tags: input.tags,
    note: input.note,
    taxExempt: input.taxExempt,
    metafields: input.metafields,
  };
}
