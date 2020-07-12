import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema.js";
import createStore from "./database.js";
import resolvers from "./resolvers.js";
import UserAPI from "./datasources/user.js";
import PostAPI from "./datasources/post.js";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import cors from "cors";

const app = express();
app.use(cors());
const issuer = process.env.JWT_ISSUER;
app.use(
  jwt({
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${issuer}.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: process.env.JWT_AUDIENCE,
    issuer: issuer,
    algorithms: ["RS256"],
    credentialsRequired: false,
    requestProperty: "auth",
  })
);

createStore().then((store) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      userAPI: new UserAPI({ store }),
      postAPI: new PostAPI({ store }),
    }),
    context: ({ req }) => {
      return {
        auth: req.auth || null,
      };
    },
    engine: {
      reportSchema: true,
    },
    introspection: false,
    playground: false,
  });

  server.applyMiddleware({ app, path: "/graphql" });

  app.get("/", function (req, res) {
    const token = JSON.stringify(req.auth);
    res.send(`<html><body><h2>hello express</h2><p>${token}</p></body></html>`);
  });

  const port = process.env.NODE_PORT || 8000;
  app.listen({ port: port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
