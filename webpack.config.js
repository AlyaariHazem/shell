// shell/webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const { share } = mf;
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "tsconfig.json"), [
  /* mapped paths to share */
]);

module.exports = {
  target: "web",
  output: {
    uniqueName: "startupTemplate",
    publicPath: "auto",
    filename: "[name].[contenthash].js",
    clean: true,
  },
  optimization: {
    runtimeChunk: false, // required for MF hosts
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },

  plugins: [
    new ModuleFederationPlugin({
      // ✅ Classic MF (script-based)
      // 'var' is typical; 'window' also works if you prefer
      library: { type: "var", name: "shell" },

      // Dynamic remotes resolved at runtime -> keep empty
      remotes: {},

      // Share only what must be singletons
      shared: share({
        "@angular/core": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/router": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/forms": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        rxjs: { singleton: true, strictVersion: true, requiredVersion: "auto" },

        // UI libs: share only if all MFEs keep versions aligned
        primeng: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },

        // Do NOT share CSS-only packages (import their styles per app)
        // primeflex: OMIT
        // primeicons: OMIT

        // Your internal libs (only if truly singleton-safe)
        // "nawras-library": {
        //   singleton: true,
        //   strictVersion: true,
        //   requiredVersion: "auto",
        // },

        // "@ngx-translate/core": {
        //   singleton: true,
        //   strictVersion: true,
        //   requiredVersion: "auto",
        // },

        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],

  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
};
