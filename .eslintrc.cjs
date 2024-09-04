module.exports = {
   root: true,
   env: { browser: true, es2020: true, "cypress/globals": true },
   extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:cypress/recommended",
      "plugin:import/errors", // Add this
      "plugin:import/warnings", // Add this
   ],
   ignorePatterns: ["dist", ".eslintrc.cjs"],
   parserOptions: { ecmaVersion: "latest", sourceType: "module" },
   settings: { react: { version: "18.2" } },
   plugins: ["react-refresh", "cypress", "import"],
   rules: {
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "import/no-unresolved": "error", // Enforce errors for unresolved imports
      "import/named": "error", // Ensure named imports correspond to named exports
      "import/default": "error", // Ensure default import is a default export in the imported module
      "import/namespace": "error", // Ensure imported namespaces contain only allowed properties
   },
};
