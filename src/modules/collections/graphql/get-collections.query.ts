import { gql } from "graphql-request";

export const GET_COLLECTIONS_QUERY = gql`
  query GetCollections($first: Int!, $query: String) {
    collections(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          updatedAt
          productsCount {
            count
          }
          seo {
            title
            description
          }
        }
      }
    }
  }
`;
