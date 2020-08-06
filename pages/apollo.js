import PostList from "../components/PostList";
import { withApollo } from "../lib/apollo";

const ApolloPage = () => (
  <div>
    <PostList />
  </div>
);

export default withApollo(ApolloPage);
