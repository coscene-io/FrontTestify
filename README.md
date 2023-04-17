# FrontTestify
前端 e2e 测试项目，项目旨在为前端项目提供更多的信心和证据

## How to start
### install dependencies
```bash
pnpm install
```

### run test
- Backend run test
```bash
npx playwright test --project=chromium
```

- Visualization of operational tests
```bash
npx playwright test --headed --project=chromium
```

- Debug and visualization of running tests on individual files
```bash
npx playwright test {{file name}} --debug --project=chromium
```