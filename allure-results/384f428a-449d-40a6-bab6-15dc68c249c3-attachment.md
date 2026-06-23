# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users.spec.ts >> Users API — CRUD >> PATCH /api/users/:id >> should partially update a user
- Location: tests/api/users.spec.ts:122:9

# Error details

```
Error: Path "job" not found in response body
```

# Test source

```ts
  1  | import type { Actor } from '../actors/Actor';
  2  | import type { Question } from '../models/screenplay.types';
  3  | 
  4  | /**
  5  |  * QUESTION: TheLastResponse
  6  |  *
  7  |  * Retrieves data from the last HTTP response stored on the Actor.
  8  |  *
  9  |  * @example
  10 |  * const status = await actor.asks(TheLastResponse.status());
  11 |  * const body   = await actor.asks(TheLastResponse.body<UserResponse>());
  12 |  * const field  = await actor.asks(TheLastResponse.bodyField<string>('data.first_name'));
  13 |  */
  14 | export class TheLastResponse {
  15 | 
  16 |   static status(): Question<number> {
  17 |     return {
  18 |       answeredBy: async (actor: Actor) => actor.lastResponseStatus,
  19 |     };
  20 |   }
  21 | 
  22 |   static body<T = unknown>(): Question<T> {
  23 |     return {
  24 |       answeredBy: async (actor: Actor) => actor.lastResponseBody as T,
  25 |     };
  26 |   }
  27 | 
  28 |   static bodyField<T = unknown>(path: string): Question<T> {
  29 |     return {
  30 |       answeredBy: async (actor: Actor) => {
  31 |         const body = actor.lastResponseBody as Record<string, unknown>;
  32 |         return path.split('.').reduce<unknown>((obj, key) => {
  33 |           if (obj && typeof obj === 'object' && key in obj) {
  34 |             return (obj as Record<string, unknown>)[key];
  35 |           }
> 36 |           throw new Error(`Path "${path}" not found in response body`);
     |                 ^ Error: Path "job" not found in response body
  37 |         }, body) as T;
  38 |       },
  39 |     };
  40 |   }
  41 | 
  42 |   static header(name: string): Question<string> {
  43 |     return {
  44 |       answeredBy: async (actor: Actor) => {
  45 |         const value = actor.lastResponseHeaders[name.toLowerCase()];
  46 |         if (!value) throw new Error(`Header "${name}" not found in response`);
  47 |         return value;
  48 |       },
  49 |     };
  50 |   }
  51 | }
  52 | 
```