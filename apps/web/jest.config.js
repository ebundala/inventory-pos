const nextJest = require("next/jest");

const createJestConfig= nextJest({
    dir: "./"
});

const customJestConfig = {
    moduleDirectories: ["node_modules",'<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        "^@/core(.*)$": "<rootDir>/src/core$1",        
        "^@/components(.*)$": "<rootDir>/src/components$1",
        "^@/data(.*)$": "<rootDir>/src/data/$1",
        "^@/layouts(.*)$": "<rootDir>/src/layouts$1",
        "^@/lib(.*)$": "<rootDir>/src/lib$1",
        "^@/styles(.*)$": "<rootDir>/src/styles$1",
        "^@/types(.*)$": "<rootDir>/src/types$1",
        
    },
    "collectCoverage": true,
    "collectCoverageFrom": ["./src/**"],
    "coverageThreshold": {
      "lines": 90
    }
}

module.exports = createJestConfig(customJestConfig);