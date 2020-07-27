import React from "react";

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withApollo } from "@apolloX/apollo";

export default (WrappedComponent) => {
  const Wrapper = withApollo((props) => {
    return (
      <WrappedComponent
        appolo={{ useQuery, useMutation }}
        gql={gql}
        {...props}
      />
    );
  });

  return Wrapper;
};
