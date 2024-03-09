module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        "/src/interfaces/controllers/paymentsRabbitmq.ts",
        "/src/interfaces/controllers/paymentsRabbitmq.test.ts",
    ],
};