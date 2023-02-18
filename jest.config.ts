export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules'],
    coverageProvider: 'v8',
    root: ['<roots>/src/'],
    testMatch: ['**/__test__/**/*.ts'],
    testEnvironment: 'jest-environment-node',
    preset: 'ts-jest'

}