module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["module-resolver", {
        "alias": {
          "@navigation": "./src/navigation",
          "@components": "./src/components",
          "@containers": "./src/containers",
          "@screens": "./src/screens",
          "@stores": "./src/stores",
          "@hooks": "./src/hooks",
          "@refs": "./src/refs",
          "@utils": "./src/utils",
          "@event": "./src/event",
          "@graphql": "./src/graphql",
          "@assets": "./assets",
        },
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ]
      }],
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "blacklist": null, // DEPRECATED
        "whitelist": null, // DEPRECATED
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }],
    ]
  };
};
