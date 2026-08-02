import { gql } from "graphql-request";

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          status
          createdAt
          updatedAt
          totalInventory
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          media(first: 1) {
            edges {
              node {
                ... on MediaImage {
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price
                inventoryQuantity
                sku
              }
            }
          }
        }
      }
    }
  }
`;
