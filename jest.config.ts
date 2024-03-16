module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    detectOpenHandles: false,
    testPathIgnorePatterns: [
        "/src/interfaces/controllers/paymentsRabbitmq.ts",
        "/src/interfaces/controllers/paymentsRabbitmq.test.ts",
        "/interfaces/controllers/paymentsRabbitmq.ts",
    ],
};