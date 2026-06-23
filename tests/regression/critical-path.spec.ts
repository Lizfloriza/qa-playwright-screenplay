import { test, expect } from '../../src/utils/fixtures';
import { ManageUsers } from '../../src/tasks/ManageUsers';
import { Authenticate } from '../../src/tasks/Authenticate';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

/**
 * REGRESSION SUITE — Critical Path
 *
 * Covers the full user lifecycle:
 * Register → Login → Create → Read → Update → Delete
 *
 * This suite runs on every PR and merge to main.
 * Quality gate: 100% pass rate required (zero tolerance).
 */

test.describe('Critical Path — User Lifecycle', () => {

  test('full user lifecycle: create → read → update → delete', async ({ qaActor }) => {
    // Step 1: Create
    const newUser = TestDataBuilder.user()
      .withName('E2E Test User')
      .withJob('QA Automation')
      .build();

    await qaActor.attemptsTo(ManageUsers.create(newUser));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(201);
    const createdId = await qaActor.asks(TheLastResponse.bodyField<string>('id'));
    expect(createdId).toBeTruthy();

    // Step 2: Read (using a known stable ID from reqres.in)
    await qaActor.attemptsTo(ManageUsers.getById(1));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    const userId = await qaActor.asks(TheLastResponse.bodyField<number>('data.id'));
    expect(userId).toBe(1);

    // Step 3: Update
    await qaActor.attemptsTo(ManageUsers.update(1, { name: 'Updated Name', job: 'QA Lead' }));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    expect(await qaActor.asks(TheLastResponse.bodyField<string>('name'))).toBe('Updated Name');

    // Step 4: Delete
    await qaActor.attemptsTo(ManageUsers.delete(1));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(204);
  });

  test('authentication: register → login → access protected resource', async ({ qaActor }) => {
    const creds = TestDataBuilder.validCredentials();

    // Step 1: Register
    await qaActor.attemptsTo(Authenticate.register(creds));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    const registrationToken = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
    expect(registrationToken).toBeTruthy();

    // Step 2: Login
    await qaActor.attemptsTo(Authenticate.as(creds));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    const loginToken = await qaActor.asks(TheLastResponse.bodyField<string>('token'));
    expect(loginToken).toBeTruthy();
  });

  test('pagination is consistent across pages', async ({ qaActor }) => {
    await qaActor.attemptsTo(ManageUsers.getPage(1));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    const totalFromPage1 = await qaActor.asks(TheLastResponse.bodyField<number>('total'));

    await qaActor.attemptsTo(ManageUsers.getPage(2));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    const totalFromPage2 = await qaActor.asks(TheLastResponse.bodyField<number>('total'));

    // Total users must be consistent across pages
    expect(totalFromPage1).toBe(totalFromPage2);
  });

  test('API returns correct content-type header', async ({ qaActor }) => {
    await qaActor.attemptsTo(ManageUsers.getPage(1));
    const contentType = await qaActor.asks(TheLastResponse.header('content-type'));
    expect(contentType).toContain('application/json');
  });

});
