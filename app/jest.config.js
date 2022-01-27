export default {
    testEnvironment: 'miniflare',
    // Configuration is automatically loaded from `.env`, `package.json` and
    // `wrangler.toml` files by default, but you can pass any additional Miniflare
    // API options here:
    // load env file
    testEnvironmentOptions: {
        bindings: { },
        kvNamespaces: ['NOTIFY_USERS'],
    },
    preset: 'ts-jest/presets/default-esm',
    globals: {
        modules: true,
        'ts-jest': {
            tsconfig: 'test/tsconfig.json',
            useESM: true
        }
    }
};

// find more at
// https://miniflare.dev/testing/jest

/*
export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "miniflare",
};
*/