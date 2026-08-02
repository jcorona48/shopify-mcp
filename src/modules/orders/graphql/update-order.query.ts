import { gql } from "graphql-request";

export const UPDATE_ORDER_QUERY = gql`
  mutation orderUpdate($input: OrderInput!) {
    orderUpdate(input: $input) {
      order {
        id
        name
        email
        tags
        note
        customAttributes {
          key
          value
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
