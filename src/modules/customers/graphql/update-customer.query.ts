import { gql } from "graphql-request";

export const UPDATE_CUSTOMER_QUERY = gql`
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        note
        tags
        taxExempt
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
      }
      userErrors {
        field
        message
      }
    }
  }
`;
