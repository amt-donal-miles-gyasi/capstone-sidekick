import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['./src/tests/test.setup.ts'],
};
export default config;
