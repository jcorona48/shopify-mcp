import { gql } from "graphql-request";

export const PRODUCT_VARIANTS_BULK_CREATE_QUERY = gql`
  mutation productVariantsBulkCreate(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
    $strategy: ProductVariantsBulkCreateStrategy
  ) {
    productVariantsBulkCreate(
      productId: $productId
      variants: $variants
      strategy: $strategy
    ) {
      productVariants {
        id
        title
        price
        sku
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const PRODUCT_VARIANTS_BULK_UPDATE_QUERY = gql`
  mutation productVariantsBulkUpdate(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        title
        price
        sku
        selectedOptions {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
