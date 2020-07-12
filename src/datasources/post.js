import { DataSource } from "apollo-datasource";

class PostAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async getPost(post, userAPI) {
    const { userId } = post;
    return userAPI
      .findOrCreateUser({
        subject: userId,
      })
      .then((user) => {
        const result = {
          author: {
            name: user.name,
            avatar: user.avatar,
          },
          id: post.id,
          title: post.title,
          contents: post.contents,
        };
        return result;
      });
  }

  async getPostById(id, userAPI) {
    return this.store.Post.findOne({
      where: {
        id: id,
      },
    }).then((post) => {
      return this.getPost(post, userAPI);
    });
  }

  async getAllPosts(userAPI) {
    return await this.store.Post.findAll().then((posts) => {
      return posts.map((post) => {
        return this.getPost(post, userAPI);
      });
    });
  }

  async createPost(id, auth, title, contents, userAPI) {
    const user = await userAPI.findOrCreateUser({ subject: id });
    if (!user) return null;
    const post = await this.store.Post.create({ title, contents, userId: id });
    const author = {
      name: user.name,
      avatar: user.avatar,
    };
    const postResult = {
      id: post.id,
      title: post.title,
      contents: post.contents,
      author,
    };
    return postResult;
  }
}

export default PostAPI;
