# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/critical-path.spec.ts >> Critical Path — User Lifecycle >> should create a post and return 201
- Location: tests/regression/critical-path.spec.ts:76:11

# Error details

```
ReferenceError: Send is not defined
```

# Test source

```ts
  1  | import { test, expect } from '../../src/utils/fixtures';
  2  | import { ManageUsers } from '../../src/tasks/ManageUsers';
  3  | import { Authenticate } from '../../src/tasks/Authenticate';
  4  | import { TheLastResponse } from '../../src/questions/TheLastResponse';
  5  | import { TestDataBuilder } from '../../src/utils/TestDataBuilder';
  6  | 
  7  | /**
  8  |  * REGRESSION SUITE — Critical Path
  9  |  *
  10 |  * Covers the full user lifecycle:
  11 |  * Register → Login → Create → Read → Update → Delete
  12 |  *
  13 |  * This suite runs on every PR and merge to main.
  14 |  * Quality gate: 100% pass rate required (zero tolerance).
  15 |  */
  16 | 
  17 | test.describe('Critical Path — User Lifecycle', () => {
  18 | 
  19 |   test('full user lifecycle: create → read → update → delete', async ({ qaActor }) => {
  20 |     // Step 1: Create
  21 |     const newUser = TestDataBuilder.user()
  22 |       .withName('E2E Test User')
  23 |       .withJob('QA Automation')
  24 |       .build();
  25 | 
  26 |     await qaActor.attemptsTo(ManageUsers.create(newUser));
  27 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(201);
  28 |     const createdId = await qaActor.asks(TheLastResponse.bodyField<string>('id'));
  29 |     expect(createdId).toBeTruthy();
  30 | 
  31 |     // Step 2: Read (using a known stable ID from reqres.in)
  32 |     await qaActor.attemptsTo(ManageUsers.getById(1));
  33 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  34 |     const userId = await qaActor.asks(TheLastResponse.bodyField<number>('data.id'));
  35 |     expect(userId).toBe(1);
  36 | 
  37 |     // Step 3: Update
  38 |     await qaActor.attemptsTo(ManageUsers.update(1, { name: 'Updated Name', job: 'QA Lead' }));
  39 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  40 |     expect(await qaActor.asks(TheLastResponse.bodyField<string>('name'))).toBe('Updated Name');
  41 | 
  42 |     // Step 4: Delete
  43 |     await qaActor.attemptsTo(ManageUsers.delete(1));
  44 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(204);
  45 |   });
  46 | 
  47 |   test('authentication: register → login → access protected resource', async ({ qaActor }) => {
  48 |     const creds = TestDataBuilder.validCredentials();
  49 | 
  50 |     // Step 1: Register
  51 |     await qaActor.attemptsTo(Authenticate.register(creds));
  52 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  53 |     const registrationToken = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
  54 |     expect(registrationToken).toBeTruthy();
  55 | 
  56 |     // Step 2: Login
  57 |     await qaActor.attemptsTo(Authenticate.as(creds));
  58 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  59 |     const loginToken = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
  60 |     expect(loginToken).toBeTruthy();
  61 |   });
  62 | 
  63 |   test('pagination is consistent across pages', async ({ qaActor }) => {
  64 |     await qaActor.attemptsTo(ManageUsers.getPage(1));
  65 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  66 |     const totalFromPage1 = await qaActor.asks(TheLastResponse.bodyField<number>('total'));
  67 | 
  68 |     await qaActor.attemptsTo(ManageUsers.getPage(2));
  69 |     expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  70 |     const totalFromPage2 = await qaActor.asks(TheLastResponse.bodyField<number>('total'));
  71 | 
  72 |     // Total users must be consistent across pages
  73 |     expect(totalFromPage1).toBe(totalFromPage2);
  74 |   });
  75 | 
  76 |       test('should create a post and return 201', async ({ qaActor }) => {
  77 |         await qaActor.attemptsTo(
> 78 |             Send.POST().to('/posts').withBody({ title: 'Test Post', body: 'Content', userId: 1 }),
     |             ^ ReferenceError: Send is not defined
  79 |         );
  80 |         expect(await qaActor.asks(TheLastResponse.status())).toBe(201);
  81 |       });
  82 | 
  83 |   test('API returns correct content-type header', async ({ qaActor }) => {
  84 |     await qaActor.attemptsTo(ManageUsers.getPage(1));
  85 |     const contentType = await qaActor.asks(TheLastResponse.header('content-type'));
  86 |     expect(contentType).toContain('application/json');
  87 |   });
  88 | 
  89 | });
  90 | 
```