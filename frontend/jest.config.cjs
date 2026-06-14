/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Override Vite-specific tsconfig settings that are incompatible with ts-jest
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          module: 'commonjs',
          // 'node' is required for CommonJS Jest — 'bundler' is Vite-only and
          // breaks relative imports when ts-jest resolves modules.
          moduleResolution: 'node',
          allowJs: true,
          strict: false,
          skipLibCheck: true,
          lib: ['ES2023', 'DOM'],
          target: 'ES2023',
          // Expose Jest globals (describe / it / expect) and the extra DOM
          // matchers from @testing-library/jest-dom (toBeInTheDocument, etc.).
          // The app tsconfig pins types to ["vite/client"] which hides both.
          types: ['jest', '@testing-library/jest-dom'],
          // Disable flags that block ts-jest compilation
          verbatimModuleSyntax: false,
          allowImportingTsExtensions: false,
          noEmit: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    // Proxy CSS modules & plain CSS imports to identity-obj-proxy
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Stub static asset imports (images, SVGs, fonts, etc.)
    '\\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$':
      '<rootDir>/__mocks__/fileMock.cjs',
  },
};
