import { gql } from "graphql-request";

export const PRODUCT_VARIANTS_BULK_DELETE_QUERY = gql`
  mutation productVariantsBulkDelete(
    $productId: ID!
    $variantsIds: [ID!]!
  ) {
    productVariantsBulkDelete(productId: $productId, variantsIds: $variantsIds) {
      product {
        id
        title
        variants(first: 20) {
          edges {
            node {
              id
              title
              price
              sku
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
