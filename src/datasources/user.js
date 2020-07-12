import { DataSource } from "apollo-datasource";

class UserAPI extends DataSource {
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

  async findOrCreateUser({ subject, name, avatar } = {}) {
    const userId =
      this.context && this.context.user ? this.context.user.id : subject;

    if (!userId) return null;

    const users = await this.store.User.findOrCreate({
      where: { id: userId },
      defaults: { name, avatar },
    });
    return users && users[0] ? users[0] : null;
  }

  async login(id, name, avatar, auth) {
    const param = { subject: id, name, avatar };
    const user = name && (await this.findOrCreateUser(param));
    if (user) return { name, avatar };
  }
}

export default UserAPI;
