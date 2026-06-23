# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/auth.spec.ts >> Auth API >> POST /api/login >> should return 400 with invalid credentials
- Location: tests/api/auth.spec.ts:40:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 404
```

# Test source

```ts
  1  | import { test, expect } from '../../src/utils/fixtures';
  2  | import { Authenticate } from '../../src/tasks/Authenticate';
  3  | import { TheLastResponse } from '../../src/questions/TheLastResponse';
  4  | import { TestDataBuilder } from '../../src/utils/TestDataBuilder';
  5  | 
  6  | /**
  7  |  * AUTH API TESTS
  8  |  * Covers: login success, login failure, register success, register failure
  9  |  * Demonstrates negative testing and error handling with Screenplay
  10 |  */
  11 | 
  12 | test.describe('Auth API', () => {
  13 | 
  14 |   test.describe('POST /api/login', () => {
  15 | 
  16 |     test('should login with valid credentials and return token', async ({ qaActor }) => {
  17 |       const creds = TestDataBuilder.validCredentials();
  18 |       await qaActor.attemptsTo(Authenticate.as(creds));
  19 | 
  20 |       const status = await qaActor.asks(TheLastResponse.status());
  21 |       const token  = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
  22 | 
  23 |       expect(status).toBe(200);
  24 |       expect(token).toBeTruthy();
  25 |       expect(token.length).toBeGreaterThan(10);
  26 |     });
  27 | 
  28 |     test('should return 400 when password is missing', async ({ guestActor }) => {
  29 |       await guestActor.attemptsTo(
  30 |         Authenticate.failToLoginWith(TestDataBuilder.incompleteCredentials()),
  31 |       );
  32 | 
  33 |       const status = await guestActor.asks(TheLastResponse.status());
  34 |       const error  = await guestActor.asks(TheLastResponse.bodyField<string>('error'));
  35 | 
  36 |       expect(status).toBe(400);
  37 |       expect(error).toContain('Missing password');
  38 |     });
  39 | 
  40 |     test('should return 400 with invalid credentials', async ({ guestActor }) => {
  41 |       await guestActor.attemptsTo(
  42 |         Authenticate.as(TestDataBuilder.invalidCredentials()),
  43 |       );
  44 | 
  45 |       const status = await guestActor.asks(TheLastResponse.status());
> 46 |       expect(status).toBe(400);
     |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  47 |     });
  48 | 
  49 |   });
  50 | 
  51 |   test.describe('POST /api/register', () => {
  52 | 
  53 |     test('should register successfully and return id + token', async ({ qaActor }) => {
  54 |       const creds = TestDataBuilder.validCredentials();
  55 |       await qaActor.attemptsTo(Authenticate.register(creds));
  56 | 
  57 |       const status = await qaActor.asks(TheLastResponse.status());
  58 |       const id     = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
  59 |       const token  = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
  60 | 
  61 |       expect(status).toBe(200);
  62 |       expect(id).toBeGreaterThan(0);
  63 |       expect(token).toBeTruthy();
  64 |     });
  65 | 
  66 |     test('should return 400 when registering without password', async ({ guestActor }) => {
  67 |       await guestActor.attemptsTo(
  68 |         Authenticate.register({ email: 'floriza@test.com', password: '' }),
  69 |       );
  70 | 
  71 |       const status = await guestActor.asks(TheLastResponse.status());
  72 |       expect(status).toBe(400);
  73 |     });
  74 | 
  75 |   });
  76 | 
  77 | });
  78 | 
```