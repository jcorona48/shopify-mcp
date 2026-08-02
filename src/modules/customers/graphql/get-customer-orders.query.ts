import { gql } from "graphql-request";

export const GET_CUSTOMER_ORDERS_QUERY = gql`
  query GetCustomerOrders($customerId: ID!, $first: Int!) {
    customer(id: $customerId) {
      id
      firstName
      lastName
      email
      orders(first: $first) {
        edges {
          node {
            id
            name
            createdAt
            email
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
