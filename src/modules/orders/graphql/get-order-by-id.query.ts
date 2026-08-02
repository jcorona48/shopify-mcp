import { gql } from "graphql-request";

export const GET_ORDER_BY_ID_QUERY = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
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
      lineItems(first: 50) {
        edges {
          node {
            id
            title
            quantity
            sku
            variant {
              id
              title
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
      customAttributes {
        key
        value
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
  }
`;
