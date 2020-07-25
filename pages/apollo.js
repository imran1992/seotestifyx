// import Layout from '../components/Layout'
// import Submit from '../components/Submit'
import PostList from '../components/PostList'
import { withApollo } from '../lib/apollo'

const ApolloPage = () => (
  <div>
    {/* <Submit /> */}
    <PostList />
  </div>
)

export default withApollo(ApolloPage)
