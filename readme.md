# Backend Service Testing Example

## Project

This project provides Azure Functions for managing devices.

### Available Endpoints

- `GET /api/devices` - List all devices
- `POST /api/devices` - Upsert (create or update) a device
- `PUT /api/devices` - Upsert (create or update) a device

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the template to create your local development settings:

   ```bash
   cp local.settings.template.json local.settings.json
   ```

   > **Note:** Never commit your `local.settings.json` to source control. The template is safe to share.

3. Build the project:

   ```bash
   npm run build
   ```

## Testing Features

This project includes the Vitest framework.

There are example unit tests in `src/domain/device.test.ts` and `src/app/list-devices.test.ts`.

Run all unit tests:

```bash
npm test
```

Run a coverage report:

```bash
npm run test:coverage
```

The framework is configured in `vitest.config.ts` for co-located unit tests: in other words, each test file (`X.test.ts`) lives beside its matching deviceion file (`X.ts`), keeping tests close to the code they verify.

> There may be other branches in this repo demonstrating additional testing features.

## How the project was upgraded to use Vitest

1. Install Vitest and associated packages:

   ```bash
   npm install --save-dev typescript@5 ts-node @types/node@22 vitest @vitest/coverage-v8
   ```

   This also upgrades the version of TypeScript.

2. Update `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "module": "nodenext",
       "esModuleInterop": true,
       "target": "es2023",
       "outDir": "dist",
       "rootDir": ".",
       "sourceMap": true,
       "strict": false
     },
     "exclude": ["node_modules", "dist", "src/**/*.test.ts", "src/**/*.spec.ts"]
   }
   ```

   The `exclude` prevents test code being compiled into your deviceion build.

3. Create `vitest.config.ts` in the root of the project:

   ```ts
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       environment: 'node',
       include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
     },
   });
   ```

   This configures it to include co-located `X.test.ts` files.

4. Add npm scripts to `package.json`

   Replace the current dummy `test` script:

   ```json
   "test": "vitest run",
   "test:watch": "vitest --watch",
   "test:coverage": "vitest run --coverage"
   ```

5. Add to `.gitignore`:

   ```
   coverage
   .vitest
   ```

   This excludes the generated test outputs from being commited to your git repo.

npm run build

func azure functionapp publish ica-function-jc76
