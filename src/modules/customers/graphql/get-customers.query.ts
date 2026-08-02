import { gql } from "graphql-request";

export const GET_CUSTOMERS_QUERY = gql`
  query GetCustomers($first: Int!, $query: String) {
    customers(first: $first, query: $query) {
      edges {
        node {
          id
          firstName
          lastName
          displayName
          email
          phone
          tags
          note
          taxExempt
          createdAt
          updatedAt
          numberOfOrders
          amountSpent {
            amount
            currencyCode
          }
          defaultAddress {
            id
            address1
            city
            country
            province
            zip
          }
        }
      }
    }
  }
`;
