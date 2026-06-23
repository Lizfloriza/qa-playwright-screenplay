import { test, expect } from '../../src/utils/fixtures';
import { ManageUsers } from '../../src/tasks/ManageUsers';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { Send } from '../../src/interactions/Send';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

test.describe('Critical Path — User Lifecycle', () => {

  test('full user lifecycle: create → read → update → delete', async ({ qaActor }) => {
    const newUser = TestDataBuilder.user().withName('E2E User').withJob('QA').build();

    await qaActor.attemptsTo(ManageUsers.create(newUser));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(201);
    const id = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
    expect(id).toBeGreaterThan(0);

    await qaActor.attemptsTo(ManageUsers.getById(1));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);

    await qaActor.attemptsTo(ManageUsers.update(1, { name: 'Updated', job: 'QA Lead' }));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
    expect(await qaActor.asks(TheLastResponse.bodyField<string>('name'))).toBe('Updated');

    await qaActor.attemptsTo(ManageUsers.delete(1));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  });

  test('posts lifecycle: create → read → update → delete', async ({ qaActor }) => {
    await qaActor.attemptsTo(
      Send.POST().to('/posts').withBody({ title: 'Test Post', body: 'Content', userId: 1 }),
    );
    expect(await qaActor.asks(TheLastResponse.status())).toBe(201);

    await qaActor.attemptsTo(Send.GET().to('/posts/1'));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);

    await qaActor.attemptsTo(
      Send.PUT().to('/posts/1').withBody({ title: 'Updated', body: 'New', userId: 1 }),
    );
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);

    await qaActor.attemptsTo(Send.DELETE().to('/posts/1'));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  });

  test('API returns correct content-type header', async ({ qaActor }) => {
    await qaActor.attemptsTo(ManageUsers.getById(1));
    const contentType = await qaActor.asks(TheLastResponse.header('content-type'));
    expect(contentType).toContain('application/json');
  });

  test('pagination returns consistent data', async ({ qaActor }) => {
    await qaActor.attemptsTo(Send.GET().to('/users').withParams({ page: 1 }));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);

    await qaActor.attemptsTo(Send.GET().to('/users').withParams({ page: 2 }));
    expect(await qaActor.asks(TheLastResponse.status())).toBe(200);
  });

});
