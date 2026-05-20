import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: 'unit',
    include: ['src/**/*.test.{js,ts}'],
    environment: 'node',
    coverage: {
      include: ['src/domain/**/*', 'src/application/**/*', 'src/infrastructure/**/*'],
    },
  },
});
