import { gql } from "graphql-request";

export const UPDATE_PRODUCT_QUERY = gql`
  mutation productUpdate($product: ProductUpdateInput!) {
    productUpdate(product: $product) {
      product {
        id
        title
        handle
        descriptionHtml
        vendor
        productType
        status
        tags
        seo {
          title
          description
        }
        metafields(first: 10) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
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
