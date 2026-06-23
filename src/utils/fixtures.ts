import { test as base, expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { CallAnApi } from '../abilities/CallAnApi';

/**
 * CUSTOM FIXTURES
 *
 * Extends Playwright's base test with Screenplay actors,
 * so every test gets a ready-to-use Actor automatically.
 *
 * @example
 * import { test, expect } from '@utils/fixtures';
 *
 * test('should create user', async ({ qaActor }) => {
 *   await qaActor.attemptsTo(ManageUsers.create({ name: 'Floriza', job: 'QA Lead' }));
 *   const status = await qaActor.asks(TheLastResponse.status());
 *   expect(status).toBe(201);
 * });
 */

type Fixtures = {
  qaActor: Actor;
  adminActor: Actor;
  guestActor: Actor;
};

export const test = base.extend<Fixtures>({
  qaActor: async ({ request, baseURL }, use) => {
    const actor = Actor.named('QA Engineer')
      .whoCan(CallAnApi.using(request, baseURL ?? ''));
    await use(actor);
  },

  adminActor: async ({ request, baseURL }, use) => {
    const actor = Actor.named('Admin')
      .whoCan(CallAnApi.using(request, baseURL ?? ''));
    await use(actor);
  },

  guestActor: async ({ request, baseURL }, use) => {
    const actor = Actor.named('Guest')
      .whoCan(CallAnApi.using(request, baseURL ?? ''));
    await use(actor);
  },
});

export { expect };
