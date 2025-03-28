// Import required plugins
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const tanstackQueryPlugin = require("@tanstack/eslint-plugin-query");
const prettierPlugin = require("eslint-plugin-prettier");

// Get Prettier options from .prettierrc for consistency
const prettierOptions = {
    singleQuote: false,
    endOfLine: "auto",
};

module.exports = [
    // Global ESLint configuration
    {
        ignores: ["**/node_modules/**", "build/**", "dist/**"],
    },
    // React configuration for source files
    {
        files: ["**/*.js", "**/*.jsx"],
        // Exclude test files for this configuration
        ignores: ["**/spec/**", "**/*.spec.js", "**/*.test.js"],
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "@tanstack/query": tanstackQueryPlugin,
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // Base React rules
            ...reactPlugin.configs.recommended.rules,
            // Disable prop-types validation
            "react/prop-types": "off",

            // React Hooks rules
            ...reactHooksPlugin.configs.recommended.rules,
            "react-hooks/exhaustive-deps": "warn",

            // TanStack Query rules - using only the available rules
            "@tanstack/query/exhaustive-deps": "error",
            "@tanstack/query/stable-query-client": "error",
            "@tanstack/query/no-rest-destructuring": "warn",
            "@tanstack/query/no-unstable-deps": "warn",
            "@tanstack/query/infinite-query-property-order": "warn",

            // Prettier rules - enforcing double quotes
            "prettier/prettier": ["error", prettierOptions],
            quotes: ["error", "double"],
        },
    },
    // Test files configuration - more lenient rules
    {
        files: ["**/spec/**/*.js", "**/*.spec.js", "**/*.test.js"],
        plugins: {
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // Only include essential rules for test files
            "react/prop-types": "off",
            // Prettier for test files - enforcing double quotes
            "prettier/prettier": ["error", prettierOptions],
            quotes: ["error", "double"],
        },
    },
];
