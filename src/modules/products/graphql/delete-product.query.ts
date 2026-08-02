import { gql } from "graphql-request";

export const DELETE_PRODUCT_QUERY = gql`
  mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;
