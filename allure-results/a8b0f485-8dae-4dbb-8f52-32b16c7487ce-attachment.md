# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/users.spec.ts >> Users API — CRUD >> DELETE /api/users/:id >> should delete a user and return 204
- Location: tests/api/users.spec.ts:136:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 204
Received: 403
```

# Test source

```ts
  40  |     test('should return 404 for non-existent user', async ({ qaActor }) => {
  41  |       await qaActor.attemptsTo(ManageUsers.getById(999));
  42  | 
  43  |       const status = await qaActor.asks(TheLastResponse.status());
  44  |       expect(status).toBe(404);
  45  |     });
  46  | 
  47  |   });
  48  | 
  49  |   test.describe('GET /api/users/:id', () => {
  50  | 
  51  |     test('should get user by id', async ({ qaActor }) => {
  52  |       await qaActor.attemptsTo(ManageUsers.getById(2));
  53  | 
  54  |       const status    = await qaActor.asks(TheLastResponse.status());
  55  |       const userId    = await qaActor.asks(TheLastResponse.bodyField<number>('data.id'));
  56  |       const userEmail = await qaActor.asks(TheLastResponse.bodyField<string>('data.email'));
  57  | 
  58  |       expect(status).toBe(200);
  59  |       expect(userId).toBe(2);
  60  |       expect(userEmail).toContain('@');
  61  |     });
  62  | 
  63  |   });
  64  | 
  65  |   test.describe('POST /api/users', () => {
  66  | 
  67  |     test('should create a new user', async ({ qaActor }) => {
  68  |       const newUser = TestDataBuilder.user()
  69  |         .withName('Floriza Crisóstomo')
  70  |         .withJob('QA Lead')
  71  |         .build();
  72  | 
  73  |       await qaActor.attemptsTo(ManageUsers.create(newUser));
  74  | 
  75  |       const status    = await qaActor.asks(TheLastResponse.status());
  76  |       const name      = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
  77  |       const job       = await qaActor.asks(TheLastResponse.bodyField<string>('job'));
  78  |       const createdAt = await qaActor.asks(TheLastResponse.bodyField<string>('createdAt'));
  79  |       const id        = await qaActor.asks(TheLastResponse.bodyField<string>('id'));
  80  | 
  81  |       expect(status).toBe(201);
  82  |       expect(name).toBe(newUser.name);
  83  |       expect(job).toBe(newUser.job);
  84  |       expect(createdAt).toBeTruthy();
  85  |       expect(id).toBeTruthy();
  86  |     });
  87  | 
  88  |     test('should create user with default data', async ({ qaActor }) => {
  89  |       const defaultUser = TestDataBuilder.user().build();
  90  | 
  91  |       await qaActor.attemptsTo(ManageUsers.create(defaultUser));
  92  | 
  93  |       const status = await qaActor.asks(TheLastResponse.status());
  94  |       expect(status).toBe(201);
  95  |     });
  96  | 
  97  |   });
  98  | 
  99  |   test.describe('PUT /api/users/:id', () => {
  100 | 
  101 |     test('should fully update a user', async ({ qaActor }) => {
  102 |       const updatedData = TestDataBuilder.user()
  103 |         .withName('Floriza Updated')
  104 |         .withJob('QA Manager')
  105 |         .build();
  106 | 
  107 |       await qaActor.attemptsTo(ManageUsers.update(2, updatedData));
  108 | 
  109 |       const status    = await qaActor.asks(TheLastResponse.status());
  110 |       const name      = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
  111 |       const updatedAt = await qaActor.asks(TheLastResponse.bodyField<string>('updatedAt'));
  112 | 
  113 |       expect(status).toBe(200);
  114 |       expect(name).toBe(updatedData.name);
  115 |       expect(updatedAt).toBeTruthy();
  116 |     });
  117 | 
  118 |   });
  119 | 
  120 |   test.describe('PATCH /api/users/:id', () => {
  121 | 
  122 |     test('should partially update a user', async ({ qaActor }) => {
  123 |       await qaActor.attemptsTo(ManageUsers.partialUpdate(2, { job: 'Senior QA Lead' }));
  124 | 
  125 |       const status = await qaActor.asks(TheLastResponse.status());
  126 |       const job    = await qaActor.asks(TheLastResponse.bodyField<string>('job'));
  127 | 
  128 |       expect(status).toBe(200);
  129 |       expect(job).toBe('Senior QA Lead');
  130 |     });
  131 | 
  132 |   });
  133 | 
  134 |   test.describe('DELETE /api/users/:id', () => {
  135 | 
  136 |     test('should delete a user and return 204', async ({ qaActor }) => {
  137 |       await qaActor.attemptsTo(ManageUsers.delete(2));
  138 | 
  139 |       const status = await qaActor.asks(TheLastResponse.status());
> 140 |       expect(status).toBe(204);
      |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  141 |     });
  142 | 
  143 |   });
  144 | 
  145 | });
  146 | 
```