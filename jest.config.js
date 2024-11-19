export default {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/$1',
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
