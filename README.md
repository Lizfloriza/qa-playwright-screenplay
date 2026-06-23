# QA Automation Framework — Playwright + Screenplay Pattern

[![QA Pipeline](https://img.shields.io/github/actions/workflow/status/YOUR_USER/qa-playwright-screenplay/qa-pipeline.yml?label=QA%20Pipeline&logo=github)](https://github.com/YOUR_USER/qa-playwright-screenplay/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.44-green?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Enterprise-grade API test automation framework built with **Playwright** and the **Screenplay design pattern** in TypeScript. Designed for scalability, maintainability, and seamless integration into CI/CD pipelines with built-in quality gates.

---

## Architecture — Screenplay Pattern

The Screenplay pattern models tests as **narratives**: Actors with Abilities who perform Tasks and ask Questions about the system's state.

```
┌─────────────────────────────────────────────────────────┐
│                      ACTOR                              │
│  "A QA Engineer who can CallAnApi"                      │
│                          │                              │
│         ┌────────────────┼────────────────┐             │
│         ▼                ▼                ▼             │
│     ABILITY           TASK            QUESTION          │
│   CallAnApi      ManageUsers      TheLastResponse       │
│  (what it can)  (what it does)   (what it knows)       │
│                          │                              │
│                    INTERACTION                          │
│                   Send.POST()                           │
│              (atomic HTTP operation)                    │
└─────────────────────────────────────────────────────────┘
```

### Why Screenplay over Page Object Model?

| | Page Object Model | Screenplay Pattern |
|---|---|---|
| **Readability** | Technical (method-centric) | Business (narrative-centric) |
| **Reusability** | Low (pages couple to tests) | High (Tasks compose freely) |
| **Scalability** | Hard (God objects) | Easy (SRP by design) |
| **Parallelism** | Shared state issues | Actor isolation → thread-safe |
| **Debugging** | Hard to trace | Clear actor intent trail |

---

## Project Structure

```
qa-playwright-screenplay/
├── src/
│   ├── abilities/          # WHAT actors can do
│   │   └── CallAnApi.ts    # Wraps Playwright APIRequestContext
│   ├── actors/             # WHO performs the tests
│   │   └── Actor.ts        # Central Screenplay agent
│   ├── interactions/       # Atomic system interactions
│   │   └── Send.ts         # HTTP request interaction
│   ├── questions/          # Ask about system state
│   │   └── TheLastResponse.ts
│   ├── tasks/              # Business-level workflows
│   │   ├── ManageUsers.ts  # CRUD operations
│   │   └── Authenticate.ts # Login / Register flows
│   ├── models/
│   │   └── screenplay.types.ts  # Core interfaces
│   └── utils/
│       ├── fixtures.ts     # Playwright custom fixtures
│       └── TestDataBuilder.ts  # Test data factory
│
├── tests/
│   ├── api/
│   │   ├── users.spec.ts   # Full CRUD test suite
│   │   └── auth.spec.ts    # Auth flows (happy + negative)
│   └── regression/
│       └── critical-path.spec.ts  # Full lifecycle regression
│
├── .github/
│   └── workflows/
│       └── qa-pipeline.yml # CI/CD with quality gates
│
├── playwright.config.ts    # Configuration + quality gates
└── .env.example            # Environment template
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/Lizfloriza/qa-playwright-screenplay.git
cd qa-playwright-screenplay

npm install
npx playwright install chromium

cp .env.example .env
# Edit .env with your values
```

### Running Tests

```bash
# All tests
npm test

# Only API tests
npm run test:api

# Only regression suite
npm run test:regression

# CI mode (with Allure reporter)
npm run test:ci
```

### Viewing Reports

```bash
npm run report
```

---

## CI/CD Pipeline

```
Push / PR
    │
    ▼
┌─────────────┐
│  Lint +     │  TypeScript check + ESLint
│  TypeCheck  │  → Fails fast on type errors
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Tests  │  Full CRUD + Auth coverage
│             │  → Parallel execution (4 workers)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Regression  │  Critical path: full lifecycle
│   Suite     │  → Runs after API tests pass
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Quality    │  Zero tolerance: 0 failures allowed
│   Gate      │  → Blocks merge if any test fails
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Allure    │  Published to GitHub Pages
│   Report    │  → Available after every main push
└─────────────┘
```

### Quality Gates

| Gate | Rule | Action on fail |
|---|---|---|
| TypeScript | Zero type errors | Block pipeline |
| ESLint | Zero lint errors | Block pipeline |
| API Tests | 100% pass rate | Block merge |
| Regression | 100% pass rate | Block merge |
| Report | Always generated | Notify team |

---

## Writing Tests — Screenplay Style

```typescript
import { test, expect } from '../../src/utils/fixtures';
import { ManageUsers } from '../../src/tasks/ManageUsers';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

test('should create a QA Lead user', async ({ qaActor }) => {
  // GIVEN: test data
  const newUser = TestDataBuilder.user()
    .withName('Floriza Crisóstomo')
    .withJob('QA Lead')
    .build();

  // WHEN: actor performs a task
  await qaActor.attemptsTo(ManageUsers.create(newUser));

  // THEN: actor asks questions about the result
  const status = await qaActor.asks(TheLastResponse.status());
  const name   = await qaActor.asks(TheLastResponse.bodyField<string>('name'));

  expect(status).toBe(201);
  expect(name).toBe('Floriza Crisóstomo');
});
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **Playwright** | Test runner + HTTP client |
| **TypeScript** | Type safety + IntelliSense |
| **Screenplay Pattern** | Architecture (SOLID principles) |
| **Allure** | Rich test reports with history |
| **GitHub Actions** | CI/CD pipeline |
| **dotenv** | Environment configuration |

---

## Key Design Decisions

**1. Screenplay over Page Object Model** — enforces Single Responsibility Principle. Each class has exactly one reason to change.

**2. Actor-as-fixture** — Playwright fixtures inject a configured Actor into every test, eliminating setup boilerplate.

**3. TestDataBuilder factory** — separates test data concerns from test logic. Easy to extend per environment.

**4. Quality gates at pipeline level** — `maxFailures: 0` in CI config ensures the pipeline never green-lights a broken build.

**5. Allure reporting** — every CI run produces a browsable report with steps, attachments, and history tracking.

---

## Author

**Floriza Crisóstomo Meza** — QA Lead | QA Automation Engineer  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-floriza--crisostomo-blue?logo=linkedin)](https://linkedin.com/in/floriza-crisostomo-b4a751182)

*Built as part of a professional QA portfolio targeting senior automation engineering roles in fintech.*
