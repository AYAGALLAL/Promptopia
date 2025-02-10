const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@components/(.*)$": "<rootDir>/components/$1",
  },
};

// ✅ Use CommonJS in Jest config to avoid GitHub Actions issues
module.exports = customJestConfig;
