/* eslint-disable import/no-anonymous-default-export */
// To rebuild the import map, run the 'npm run pretest' command
export default {
  srcDir: "src",
  srcFiles: [],
  specDir: "spec",
  specFiles: [
    "**/*.spec.js"
  ],
  helpers: [
    "support/test-helpers.js"
  ],
  esmFilenameExtension: ".js",
  modulesWithSideEffectsInSrcFiles: false,
  enableTopLevelAwait: true,
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: true,
    forbidDuplicateNames: true
  },
  // This import map should use the same versions as your package.json to ensure compatibility with
  // the latest versions of React, ReactDOM, and Testing Library via
  // To rebuild the import map, run the 'npm run pretest' command
  importMap: {
    imports: {
      "react": "https://esm.sh/react@19.0.0",
      "react-dom": "https://esm.sh/react-dom@19.0.0",
      "react-dom/client": "https://esm.sh/react-dom@19.0.0/client",
      "@testing-library/react": "https://esm.sh/@testing-library/react@16.2.0"
    }
  },
  listenAddress: "localhost",
  hostname: "localhost",
  browser: {
    name: "chrome"
  },
  babel: {
    plugins: [],
    presets: [
      ["@babel/preset-env", { targets: { browsers: ["chrome", "firefox", "edge", "safari"] } }],
      ["@babel/preset-react", { 
        runtime: "automatic", 
        development: true,
        throwIfNamespace: false
      }]
    ]
  }
};