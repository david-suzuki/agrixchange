const withImages = require("next-images");
const { withPlugins } = require("next-compose-plugins");


const nextConfig = {
  /*env: {
    API_URL: "https://multikart-graphql-dun.vercel.app/server.js",
    API_URL: "http://localhost:8000/graphql",
  },*/

  serverRuntimeConfig: {
    secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
  },
  // if you want to run with local graphQl un-comment below one and comment the above code
  publicRuntimeConfig: {
    API_URL: "https://agrixchange.blueboxonline.com/?api",
    SERVER_URL: "https://agrixchange.blueboxonline.com",
    CONTENTS_URL: "https://agrixchange.blueboxonline.com/",

    API_KEY: "oo568bc6fd9hp3WcE7Ui0244d1boadre",
    API_SECRET: "vv36ebali44"

  },

  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withPlugins([withImages], nextConfig);
