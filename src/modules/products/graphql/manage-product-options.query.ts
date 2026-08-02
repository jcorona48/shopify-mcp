import { gql } from "graphql-request";

export const PRODUCT_OPTIONS_FIELDS_FRAGMENT = gql`
  fragment ProductOptionsFields on Product {
    id
    title
    options {
      id
      name
      position
      optionValues {
        id
        name
        hasVariants
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          price
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

export const PRODUCT_OPTIONS_CREATE_QUERY = gql`
  mutation productOptionsCreate(
    $productId: ID!
    $options: [OptionCreateInput!]!
  ) {
    productOptionsCreate(
      productId: $productId
      options: $options
      variantStrategy: LEAVE_AS_IS
    ) {
      product {
        ...ProductOptionsFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_OPTION_UPDATE_QUERY = gql`
  mutation productOptionUpdate(
    $productId: ID!
    $option: OptionUpdateInput!
    $optionValuesToAdd: [OptionValueCreateInput!]
    $optionValuesToDelete: [ID!]
  ) {
    productOptionUpdate(
      productId: $productId
      option: $option
      optionValuesToAdd: $optionValuesToAdd
      optionValuesToDelete: $optionValuesToDelete
    ) {
      product {
        ...ProductOptionsFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const PRODUCT_OPTIONS_DELETE_QUERY = gql`
  mutation productOptionsDelete($productId: ID!, $options: [ID!]!) {
    productOptionsDelete(productId: $productId, options: $options) {
      product {
        ...ProductOptionsFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;
