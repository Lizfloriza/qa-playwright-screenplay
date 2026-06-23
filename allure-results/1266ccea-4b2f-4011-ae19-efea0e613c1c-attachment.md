# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression/critical-path.spec.ts >> Critical Path — User Lifecycle >> should create a post and return 201
- Location: tests/regression/critical-path.spec.ts:77:7

# Error details

```
Error: apiRequestContext.post: getaddrinfo ENOTFOUND reqres.inhttps
Call log:
  - → POST https://reqres.inhttps//jsonplaceholder.typicode.com/posts
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.7827.55 Safari/537.36
    - accept: application/json
    - accept-encoding: gzip,deflate,br
    - Content-Type: application/json
    - x-api-key: free_user_3FW5MaLzwbXV3fnOFOpfCKLMYuX
    - content-length: 49

```

# Test source

```ts
  1  | import type { APIRequestContext } from '@playwright/test';
  2  | import type { Ability } from '../models/screenplay.types';
  3  | 
  4  | export interface RequestOptions {
  5  |   headers?: Record<string, string>;
  6  |   params?: Record<string, string | number | boolean>;
  7  |   data?: unknown;
  8  |   timeout?: number;
  9  | }
  10 | 
  11 | /**
  12 |  * ABILITY: CallAnApi
  13 |  *
  14 |  * Gives an Actor the ability to make HTTP requests using
  15 |  * Playwright's APIRequestContext.
  16 |  *
  17 |  * @example
  18 |  * actor.whoCan(CallAnApi.using(request))
  19 |  */
  20 | export class CallAnApi implements Ability {
  21 |   static readonly abilityName = 'CallAnApi';
  22 |   readonly name = CallAnApi.abilityName;
  23 | 
  24 |   private constructor(
  25 |     private readonly requestContext: APIRequestContext,
  26 |     private readonly baseUrl: string,
  27 |   ) {}
  28 | 
  29 |   static using(request: APIRequestContext, baseUrl = ''): CallAnApi {
  30 |     return new CallAnApi(request, baseUrl);
  31 |   }
  32 | 
  33 |   async get(path: string, options?: RequestOptions) {
  34 |     return this.requestContext.get(`${this.baseUrl}${path}`, {
  35 |       headers: options?.headers,
  36 |       params: options?.params as Record<string, string>,
  37 |       timeout: options?.timeout,
  38 |     });
  39 |   }
  40 | 
  41 |   async post(path: string, options?: RequestOptions) {
> 42 |     return this.requestContext.post(`${this.baseUrl}${path}`, {
     |                                ^ Error: apiRequestContext.post: getaddrinfo ENOTFOUND reqres.inhttps
  43 |       headers: options?.headers,
  44 |       data: options?.data,
  45 |       timeout: options?.timeout,
  46 |     });
  47 |   }
  48 | 
  49 |   async put(path: string, options?: RequestOptions) {
  50 |     return this.requestContext.put(`${this.baseUrl}${path}`, {
  51 |       headers: options?.headers,
  52 |       data: options?.data,
  53 |       timeout: options?.timeout,
  54 |     });
  55 |   }
  56 | 
  57 |   async patch(path: string, options?: RequestOptions) {
  58 |     return this.requestContext.patch(`${this.baseUrl}${path}`, {
  59 |       headers: options?.headers,
  60 |       data: options?.data,
  61 |       timeout: options?.timeout,
  62 |     });
  63 |   }
  64 | 
  65 |   async delete(path: string, options?: RequestOptions) {
  66 |     return this.requestContext.delete(`${this.baseUrl}${path}`, {
  67 |       headers: options?.headers,
  68 |       timeout: options?.timeout,
  69 |     });
  70 |   }
  71 | }
  72 | 
```