/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from '@/shared/generated/admin.types.js';

export type GetCollectionsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetCollectionsQuery = { collections: { edges: Array<{ node: (
        Pick<AdminTypes.Collection, 'id' | 'title' | 'handle' | 'description' | 'descriptionHtml' | 'updatedAt'>
        & { productsCount?: AdminTypes.Maybe<Pick<AdminTypes.Count, 'count'>>, seo: Pick<AdminTypes.Seo, 'title' | 'description'> }
      ) }> } };

export type CollectionUpdateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CollectionInput;
}>;


export type CollectionUpdateMutation = { collectionUpdate?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<(
      Pick<AdminTypes.Collection, 'id' | 'title' | 'handle' | 'description' | 'descriptionHtml' | 'updatedAt'>
      & { seo: Pick<AdminTypes.Seo, 'title' | 'description'> }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetCustomerOrdersQueryVariables = AdminTypes.Exact<{
  customerId: AdminTypes.Scalars['ID']['input'];
  first: AdminTypes.Scalars['Int']['input'];
}>;


export type GetCustomerOrdersQuery = { customer?: AdminTypes.Maybe<(
    Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email'>
    & { orders: { edges: Array<{ node: (
          Pick<AdminTypes.Order, 'id' | 'name' | 'createdAt' | 'email' | 'displayFinancialStatus' | 'displayFulfillmentStatus'>
          & { totalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) }> } }
  )> };

export type GetCustomersQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetCustomersQuery = { customers: { edges: Array<{ node: (
        Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'displayName' | 'email' | 'phone' | 'tags' | 'note' | 'taxExempt' | 'createdAt' | 'updatedAt' | 'numberOfOrders'>
        & { amountSpent: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, defaultAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'id' | 'address1' | 'city' | 'country' | 'province' | 'zip'>> }
      ) }> } };

export type CustomerUpdateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CustomerInput;
}>;


export type CustomerUpdateMutation = { customerUpdate?: AdminTypes.Maybe<{ customer?: AdminTypes.Maybe<(
      Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'note' | 'tags' | 'taxExempt'>
      & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value'> }> } }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetOrderByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetOrderByIdQuery = { order?: AdminTypes.Maybe<(
    Pick<AdminTypes.Order, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'email' | 'tags' | 'note' | 'displayFinancialStatus' | 'displayFulfillmentStatus' | 'currencyCode'>
    & { totalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, subtotalPriceSet?: AdminTypes.Maybe<{ shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }>, customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email'>>, lineItems: { edges: Array<{ node: (
          Pick<AdminTypes.LineItem, 'id' | 'title' | 'quantity' | 'sku'>
          & { variant?: AdminTypes.Maybe<Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'>> }
        ) }> }, shippingAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'address1' | 'address2' | 'city' | 'company' | 'country' | 'firstName' | 'lastName' | 'phone' | 'province' | 'zip'>>, customAttributes: Array<Pick<AdminTypes.Attribute, 'key' | 'value'>>, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value'> }> } }
  )> };

export type GetOrdersQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetOrdersQuery = { orders: { edges: Array<{ node: (
        Pick<AdminTypes.Order, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'email' | 'tags' | 'note' | 'displayFinancialStatus' | 'displayFulfillmentStatus' | 'currencyCode'>
        & { totalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, subtotalPriceSet?: AdminTypes.Maybe<{ shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }>, customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email'>>, lineItems: { edges: Array<{ node: (
              Pick<AdminTypes.LineItem, 'id' | 'title' | 'quantity'>
              & { variant?: AdminTypes.Maybe<Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'sku' | 'price'>> }
            ) }> }, shippingAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'address1' | 'address2' | 'city' | 'company' | 'country' | 'firstName' | 'lastName' | 'phone' | 'province' | 'zip'>> }
      ) }> } };

export type OrderUpdateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.OrderInput;
}>;


export type OrderUpdateMutation = { orderUpdate?: AdminTypes.Maybe<{ order?: AdminTypes.Maybe<(
      Pick<AdminTypes.Order, 'id' | 'name' | 'email' | 'tags' | 'note'>
      & { customAttributes: Array<Pick<AdminTypes.Attribute, 'key' | 'value'>>, shippingAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'address1' | 'address2' | 'city' | 'company' | 'country' | 'firstName' | 'lastName' | 'phone' | 'province' | 'zip'>>, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value'> }> } }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type ProductCreateMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductCreateInput;
  media?: AdminTypes.InputMaybe<Array<AdminTypes.CreateMediaInput> | AdminTypes.CreateMediaInput>;
}>;


export type ProductCreateMutation = { productCreate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'descriptionHtml' | 'vendor' | 'productType' | 'status' | 'tags'>
      & { seo: Pick<AdminTypes.Seo, 'title' | 'description'>, options: Array<Pick<AdminTypes.ProductOption, 'id' | 'name' | 'values'>>, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value'> }> } }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type ProductVariantsBulkDeleteMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variantsIds: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type ProductVariantsBulkDeleteMutation = { productVariantsBulkDelete?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title'>
      & { variants: { edges: Array<{ node: (
            Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'sku'>
            & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductVariantsBulkDeleteUserError, 'field' | 'message'>> }> };

export type ProductDeleteMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.ProductDeleteInput;
}>;


export type ProductDeleteMutation = { productDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.ProductDeletePayload, 'deletedProductId'>
    & { userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }
  )> };

export type GetProductByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductByIdQuery = { product?: AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id' | 'title' | 'description' | 'handle' | 'status' | 'createdAt' | 'updatedAt' | 'totalInventory' | 'tags' | 'vendor'>
    & { priceRangeV2: { minVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, images: { edges: Array<{ node: Pick<AdminTypes.Image, 'id' | 'url' | 'altText' | 'width' | 'height'> }> }, variants: { edges: Array<{ node: (
          Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'inventoryQuantity' | 'sku'>
          & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
        ) }> }, collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title'> }> } }
  )> };

export type GetProductsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetProductsQuery = { products: { edges: Array<{ node: (
        Pick<AdminTypes.Product, 'id' | 'title' | 'description' | 'handle' | 'status' | 'createdAt' | 'updatedAt' | 'totalInventory'>
        & { priceRangeV2: { minVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, images: { edges: Array<{ node: Pick<AdminTypes.Image, 'url' | 'altText'> }> }, variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'inventoryQuantity' | 'sku'> }> } }
      ) }> } };

export type ProductOptionsFieldsFragment = (
  Pick<AdminTypes.Product, 'id' | 'title'>
  & { options: Array<(
    Pick<AdminTypes.ProductOption, 'id' | 'name' | 'position'>
    & { optionValues: Array<Pick<AdminTypes.ProductOptionValue, 'id' | 'name' | 'hasVariants'>> }
  )>, variants: { edges: Array<{ node: (
        Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'>
        & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
      ) }> } }
);

export type ProductOptionsCreateMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  options: Array<AdminTypes.OptionCreateInput> | AdminTypes.OptionCreateInput;
}>;


export type ProductOptionsCreateMutation = { productOptionsCreate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title'>
      & { options: Array<(
        Pick<AdminTypes.ProductOption, 'id' | 'name' | 'position'>
        & { optionValues: Array<Pick<AdminTypes.ProductOptionValue, 'id' | 'name' | 'hasVariants'>> }
      )>, variants: { edges: Array<{ node: (
            Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'>
            & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductOptionsCreateUserError, 'field' | 'message' | 'code'>> }> };

export type ProductOptionUpdateMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  option: AdminTypes.OptionUpdateInput;
  optionValuesToAdd?: AdminTypes.InputMaybe<Array<AdminTypes.OptionValueCreateInput> | AdminTypes.OptionValueCreateInput>;
  optionValuesToDelete?: AdminTypes.InputMaybe<Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input']>;
}>;


export type ProductOptionUpdateMutation = { productOptionUpdate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title'>
      & { options: Array<(
        Pick<AdminTypes.ProductOption, 'id' | 'name' | 'position'>
        & { optionValues: Array<Pick<AdminTypes.ProductOptionValue, 'id' | 'name' | 'hasVariants'>> }
      )>, variants: { edges: Array<{ node: (
            Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'>
            & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductOptionUpdateUserError, 'field' | 'message' | 'code'>> }> };

export type ProductOptionsDeleteMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  options: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type ProductOptionsDeleteMutation = { productOptionsDelete?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title'>
      & { options: Array<(
        Pick<AdminTypes.ProductOption, 'id' | 'name' | 'position'>
        & { optionValues: Array<Pick<AdminTypes.ProductOptionValue, 'id' | 'name' | 'hasVariants'>> }
      )>, variants: { edges: Array<{ node: (
            Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'>
            & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductOptionsDeleteUserError, 'field' | 'message' | 'code'>> }> };

export type ProductVariantsBulkCreateMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variants: Array<AdminTypes.ProductVariantsBulkInput> | AdminTypes.ProductVariantsBulkInput;
  strategy?: AdminTypes.InputMaybe<AdminTypes.ProductVariantsBulkCreateStrategy>;
}>;


export type ProductVariantsBulkCreateMutation = { productVariantsBulkCreate?: AdminTypes.Maybe<{ productVariants?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'sku'>
      & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
    )>>, userErrors: Array<Pick<AdminTypes.ProductVariantsBulkCreateUserError, 'field' | 'message'>> }> };

export type ProductVariantsBulkUpdateMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variants: Array<AdminTypes.ProductVariantsBulkInput> | AdminTypes.ProductVariantsBulkInput;
}>;


export type ProductVariantsBulkUpdateMutation = { productVariantsBulkUpdate?: AdminTypes.Maybe<{ productVariants?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'sku'>
      & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
    )>>, userErrors: Array<Pick<AdminTypes.ProductVariantsBulkUpdateUserError, 'field' | 'message'>> }> };

export type ProductUpdateMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductUpdateInput;
}>;


export type ProductUpdateMutation = { productUpdate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'descriptionHtml' | 'vendor' | 'productType' | 'status' | 'tags'>
      & { seo: Pick<AdminTypes.Seo, 'title' | 'description'>, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value'> }> }, variants: { edges: Array<{ node: (
            Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price' | 'sku'>
            & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
          ) }> } }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
  "\n  query GetCollections($first: Int!, $query: String) {\n    collections(first: $first, query: $query) {\n      edges {\n        node {\n          id\n          title\n          handle\n          description\n          descriptionHtml\n          updatedAt\n          productsCount {\n            count\n          }\n          seo {\n            title\n            description\n          }\n        }\n      }\n    }\n  }\n": {return: GetCollectionsQuery, variables: GetCollectionsQueryVariables},
  "\n  query GetCustomerOrders($customerId: ID!, $first: Int!) {\n    customer(id: $customerId) {\n      id\n      firstName\n      lastName\n      email\n      orders(first: $first) {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            email\n            displayFinancialStatus\n            displayFulfillmentStatus\n            totalPriceSet {\n              shopMoney {\n                amount\n                currencyCode\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: GetCustomerOrdersQuery, variables: GetCustomerOrdersQueryVariables},
  "\n  query GetCustomers($first: Int!, $query: String) {\n    customers(first: $first, query: $query) {\n      edges {\n        node {\n          id\n          firstName\n          lastName\n          displayName\n          email\n          phone\n          tags\n          note\n          taxExempt\n          createdAt\n          updatedAt\n          numberOfOrders\n          amountSpent {\n            amount\n            currencyCode\n          }\n          defaultAddress {\n            id\n            address1\n            city\n            country\n            province\n            zip\n          }\n        }\n      }\n    }\n  }\n": {return: GetCustomersQuery, variables: GetCustomersQueryVariables},
  "\n  query GetOrderById($id: ID!) {\n    order(id: $id) {\n      id\n      name\n      createdAt\n      updatedAt\n      email\n      tags\n      note\n      displayFinancialStatus\n      displayFulfillmentStatus\n      totalPriceSet {\n        shopMoney {\n          amount\n          currencyCode\n        }\n      }\n      subtotalPriceSet {\n        shopMoney {\n          amount\n          currencyCode\n        }\n      }\n      currencyCode\n      customer {\n        id\n        firstName\n        lastName\n        email\n      }\n      lineItems(first: 50) {\n        edges {\n          node {\n            id\n            title\n            quantity\n            sku\n            variant {\n              id\n              title\n              price\n            }\n          }\n        }\n      }\n      shippingAddress {\n        address1\n        address2\n        city\n        company\n        country\n        firstName\n        lastName\n        phone\n        province\n        zip\n      }\n      customAttributes {\n        key\n        value\n      }\n      metafields(first: 10) {\n        edges {\n          node {\n            id\n            namespace\n            key\n            value\n          }\n        }\n      }\n    }\n  }\n": {return: GetOrderByIdQuery, variables: GetOrderByIdQueryVariables},
  "\n  query GetOrders($first: Int!, $query: String) {\n    orders(first: $first, query: $query) {\n      edges {\n        node {\n          id\n          name\n          createdAt\n          updatedAt\n          email\n          tags\n          note\n          displayFinancialStatus\n          displayFulfillmentStatus\n          totalPriceSet {\n            shopMoney {\n              amount\n              currencyCode\n            }\n          }\n          subtotalPriceSet {\n            shopMoney {\n              amount\n              currencyCode\n            }\n          }\n          currencyCode\n          customer {\n            id\n            firstName\n            lastName\n            email\n          }\n          lineItems(first: 5) {\n            edges {\n              node {\n                id\n                title\n                quantity\n                variant {\n                  id\n                  title\n                  sku\n                  price\n                }\n              }\n            }\n          }\n          shippingAddress {\n            address1\n            address2\n            city\n            company\n            country\n            firstName\n            lastName\n            phone\n            province\n            zip\n          }\n        }\n      }\n    }\n  }\n": {return: GetOrdersQuery, variables: GetOrdersQueryVariables},
  "\n  query GetProductById($id: ID!) {\n    product(id: $id) {\n      id\n      title\n      description\n      handle\n      status\n      createdAt\n      updatedAt\n      totalInventory\n      priceRangeV2 {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      images(first: 5) {\n        edges {\n          node {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n      variants(first: 20) {\n        edges {\n          node {\n            id\n            title\n            price\n            inventoryQuantity\n            sku\n            selectedOptions {\n              name\n              value\n            }\n          }\n        }\n      }\n      collections(first: 5) {\n        edges {\n          node {\n            id\n            title\n          }\n        }\n      }\n      tags\n      vendor\n    }\n  }\n": {return: GetProductByIdQuery, variables: GetProductByIdQueryVariables},
  "\n  query GetProducts($first: Int!, $query: String) {\n    products(first: $first, query: $query) {\n      edges {\n        node {\n          id\n          title\n          description\n          handle\n          status\n          createdAt\n          updatedAt\n          totalInventory\n          priceRangeV2 {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          images(first: 1) {\n            edges {\n              node {\n                url\n                altText\n              }\n            }\n          }\n          variants(first: 5) {\n            edges {\n              node {\n                id\n                title\n                price\n                inventoryQuantity\n                sku\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: GetProductsQuery, variables: GetProductsQueryVariables},
}

interface GeneratedMutationTypes {
  "\n  mutation collectionUpdate($input: CollectionInput!) {\n    collectionUpdate(input: $input) {\n      collection {\n        id\n        title\n        handle\n        description\n        descriptionHtml\n        updatedAt\n        seo {\n          title\n          description\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CollectionUpdateMutation, variables: CollectionUpdateMutationVariables},
  "\n  mutation customerUpdate($input: CustomerInput!) {\n    customerUpdate(input: $input) {\n      customer {\n        id\n        firstName\n        lastName\n        email\n        phone\n        note\n        tags\n        taxExempt\n        metafields(first: 10) {\n          edges {\n            node {\n              id\n              namespace\n              key\n              value\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CustomerUpdateMutation, variables: CustomerUpdateMutationVariables},
  "\n  mutation orderUpdate($input: OrderInput!) {\n    orderUpdate(input: $input) {\n      order {\n        id\n        name\n        email\n        tags\n        note\n        customAttributes {\n          key\n          value\n        }\n        shippingAddress {\n          address1\n          address2\n          city\n          company\n          country\n          firstName\n          lastName\n          phone\n          province\n          zip\n        }\n        metafields(first: 10) {\n          edges {\n            node {\n              id\n              namespace\n              key\n              value\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: OrderUpdateMutation, variables: OrderUpdateMutationVariables},
  "\n  mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {\n    productCreate(product: $product, media: $media) {\n      product {\n        id\n        title\n        handle\n        descriptionHtml\n        vendor\n        productType\n        status\n        tags\n        seo {\n          title\n          description\n        }\n        options {\n          id\n          name\n          values\n        }\n        metafields(first: 10) {\n          edges {\n            node {\n              id\n              namespace\n              key\n              value\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductCreateMutation, variables: ProductCreateMutationVariables},
  "\n  mutation productVariantsBulkDelete(\n    $productId: ID!\n    $variantsIds: [ID!]!\n  ) {\n    productVariantsBulkDelete(productId: $productId, variantsIds: $variantsIds) {\n      product {\n        id\n        title\n        variants(first: 20) {\n          edges {\n            node {\n              id\n              title\n              price\n              sku\n              selectedOptions {\n                name\n                value\n              }\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductVariantsBulkDeleteMutation, variables: ProductVariantsBulkDeleteMutationVariables},
  "\n  mutation productDelete($input: ProductDeleteInput!) {\n    productDelete(input: $input) {\n      deletedProductId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductDeleteMutation, variables: ProductDeleteMutationVariables},
  "\n  mutation productOptionsCreate(\n    $productId: ID!\n    $options: [OptionCreateInput!]!\n  ) {\n    productOptionsCreate(\n      productId: $productId\n      options: $options\n      variantStrategy: LEAVE_AS_IS\n    ) {\n      product {\n        ...ProductOptionsFields\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n": {return: ProductOptionsCreateMutation, variables: ProductOptionsCreateMutationVariables},
  "\n  mutation productOptionUpdate(\n    $productId: ID!\n    $option: OptionUpdateInput!\n    $optionValuesToAdd: [OptionValueCreateInput!]\n    $optionValuesToDelete: [ID!]\n  ) {\n    productOptionUpdate(\n      productId: $productId\n      option: $option\n      optionValuesToAdd: $optionValuesToAdd\n      optionValuesToDelete: $optionValuesToDelete\n    ) {\n      product {\n        ...ProductOptionsFields\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n": {return: ProductOptionUpdateMutation, variables: ProductOptionUpdateMutationVariables},
  "\n  mutation productOptionsDelete($productId: ID!, $options: [ID!]!) {\n    productOptionsDelete(productId: $productId, options: $options) {\n      product {\n        ...ProductOptionsFields\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n": {return: ProductOptionsDeleteMutation, variables: ProductOptionsDeleteMutationVariables},
  "\n  mutation productVariantsBulkCreate(\n    $productId: ID!\n    $variants: [ProductVariantsBulkInput!]!\n    $strategy: ProductVariantsBulkCreateStrategy\n  ) {\n    productVariantsBulkCreate(\n      productId: $productId\n      variants: $variants\n      strategy: $strategy\n    ) {\n      productVariants {\n        id\n        title\n        price\n        sku\n        selectedOptions {\n          name\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductVariantsBulkCreateMutation, variables: ProductVariantsBulkCreateMutationVariables},
  "\n  mutation productVariantsBulkUpdate(\n    $productId: ID!\n    $variants: [ProductVariantsBulkInput!]!\n  ) {\n    productVariantsBulkUpdate(productId: $productId, variants: $variants) {\n      productVariants {\n        id\n        title\n        price\n        sku\n        selectedOptions {\n          name\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductVariantsBulkUpdateMutation, variables: ProductVariantsBulkUpdateMutationVariables},
  "\n  mutation productUpdate($product: ProductUpdateInput!) {\n    productUpdate(product: $product) {\n      product {\n        id\n        title\n        handle\n        descriptionHtml\n        vendor\n        productType\n        status\n        tags\n        seo {\n          title\n          description\n        }\n        metafields(first: 10) {\n          edges {\n            node {\n              id\n              namespace\n              key\n              value\n            }\n          }\n        }\n        variants(first: 20) {\n          edges {\n            node {\n              id\n              title\n              price\n              sku\n              selectedOptions {\n                name\n                value\n              }\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: ProductUpdateMutation, variables: ProductUpdateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
