const resolvers = {
  Query: {
    me: () => {
      return {
        username: "Robin Wieruch",
      };
    },
    post: (_, { id }, { dataSources }) =>
      dataSources.postAPI.getPostById(id, dataSources.userAPI),
    posts: (_, __, { dataSources }) =>
      dataSources.postAPI.getAllPosts(dataSources.userAPI),
  },

  Mutation: {
    login: (_, { id, name, avatar }, { dataSources, auth }) => {
      return dataSources.userAPI.login(id, name, avatar, auth);
    },
    createPost: (_, { id, title, contents }, { dataSources, auth }) =>
      dataSources.postAPI.createPost(
        id,
        auth,
        title,
        contents,
        dataSources.userAPI
      ),
  },
};

export default resolvers;
