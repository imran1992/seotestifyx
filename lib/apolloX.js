import { useMemo } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "https://api.schoolx.pk/graphql", // Server URL (must be absolute)
      credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
      useGETForQueries: true,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

//import { gql, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
export const getApolloClient = (initialState = {}) => {
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      credentials: "same-origin",
      useGETForQueries: true,
      uri: "https://api.schoolx.pk/graphql",
      fetch,
    }),
  });
};