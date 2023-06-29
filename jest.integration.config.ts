import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['./src/tests/test.setup.ts'],
  globalSetup: './src/tests/test.globalSetup.ts',
  globalTeardown: './src/tests/test.globalTeardown.ts',
};
export default config;
