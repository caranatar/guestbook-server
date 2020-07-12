import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    me: User
    posts: [Post]!
    post(id: ID!): Post
  }

  type User {
    username: String!
  }

  type Post {
    id: ID!
    author: AuthorResult!
    title: String
    contents: String!
  }

  type AuthorResult {
    name: String!
    avatar: String
  }

  type Mutation {
    login(id: String!, name: String, avatar: String): AuthorResult
    createPost(id: String!, title: String, contents: String!): Post
  }
`;

export default typeDefs;
