import { test, expect } from '../../src/utils/fixtures';
import { Send } from '../../src/interactions/Send';
import { TheLastResponse } from '../../src/questions/TheLastResponse';

test.describe('Posts API', () => {

  test('should create a post', async ({ qaActor }) => {
    await qaActor.attemptsTo(
      Send.POST().to('/posts').withBody({ title: 'QA Lead', body: 'Automation', userId: 1 }),
    );
    const status = await qaActor.asks(TheLastResponse.status());
    expect(status).toBe(201);
  });

  test('should get a post', async ({ qaActor }) => {
    await qaActor.attemptsTo(Send.GET().to('/posts/1'));
    const status = await qaActor.asks(TheLastResponse.status());
    expect(status).toBe(200);
  });

  test('should return 404 for non-existent post', async ({ qaActor }) => {
    await qaActor.attemptsTo(Send.GET().to('/posts/99999'));
    const status = await qaActor.asks(TheLastResponse.status());
    expect(status).toBe(404);
  });

});
