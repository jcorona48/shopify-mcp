import { gidFor } from "@/shared/gid";
import type { UpdateOrderInput } from "@/modules/orders/dto/update-order.dto";

export function toUpdateOrderInput(input: UpdateOrderInput) {
  return {
    id: gidFor("Order", input.id),
    email: input.email,
    note: input.note,
    tags: input.tags,
    customAttributes: input.customAttributes,
    metafields: input.metafields,
    shippingAddress: input.shippingAddress,
  };
}
