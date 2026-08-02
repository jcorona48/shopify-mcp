import { gql } from "graphql-request";

export const UPDATE_COLLECTION_QUERY = gql`
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id
        title
        handle
        description
        descriptionHtml
        updatedAt
        seo {
          title
          description
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
