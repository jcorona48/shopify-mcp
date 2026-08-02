import { gql } from "graphql-request";

export const GET_ORDERS_QUERY = gql`
  query GetOrders($first: Int!, $query: String) {
    orders(first: $first, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          updatedAt
          email
          tags
          note
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          subtotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          currencyCode
          customer {
            id
            firstName
            lastName
            email
          }
          lineItems(first: 5) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  sku
                  price
                }
              }
            }
          }
          shippingAddress {
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
    }
  }
`;
