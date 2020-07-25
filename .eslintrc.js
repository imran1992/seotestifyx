module.exports = {
  plugins: ["react", "flowtype", "security"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    sourceType: "module",
    useJSXTextNode: false
  },
  env: {
    browser: true,
    es2020: true,
    commonjs: true,
  },
  extends: [
    "airbnb",
    "plugin:flowtype/recommended",
    "plugin:security/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/state-in-constructor": [0, "never"],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        ignoredNodes: ["TemplateLiteral"]
      }
    ],
    "no-console": 0,
    camelcase: 0,
    "react/jsx-curly-newline": 0,
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "react/jsx-closing-bracket-location": "off",
    "no-return-assign": 0,
    "react/jsx-boolean-value": 0,
    "react/jsx-props-no-spreading": 0,
    "react/sort-comp": 0,
    "react/jsx-one-expression-per-line": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "arrow-body-style": 0,
    "no-nested-ternary": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"]
      }
    ],
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "react/jsx-curly-brace-presence": 0,
    "react/jsx-wrap-multilines": "off",
    "react/destructuring-assignment": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/alt-text": "off",
    "max-len": [
      "error",
      {
        code: 200,
        ignoreComments: true,
        ignoreStrings: true
      }
    ],
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 0,
    "global-require": "off",
    "prefer-promise-reject-errors": "off",
    "padded-blocks": "off",
    "react/no-typos": "off",
    "no-underscore-dangle": "warn",
    "react/prop-types": [
      "off",
      {
        ignore: ["componentId"]
      }
    ],
    "react/forbid-prop-types": ["off"],
    "react/jsx-closing-tag-location": ["off"],
    "no-use-before-define": ["error", { variables: false, functions: false }],
    "linebreak-style": "off",
    "object-curly-spacing": ["error", "never"],
    "template-curly-spacing": "off",
    "react/no-unescaped-entities": "off"
  }
};
