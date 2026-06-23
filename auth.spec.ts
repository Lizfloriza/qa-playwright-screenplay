import { test, expect } from '../../src/utils/fixtures';
import { Send } from '../../src/interactions/Send';
import { TheLastResponse } from '../../src/questions/TheLastResponse';

/**
 * AUTH-LIKE TESTS using JSONPlaceholder /posts
 * JSONPlaceholder does not have auth endpoints,
 * so we simulate auth flows with posts CRUD.
 */

test.describe('Posts API — Auth-like flows', () => {

  test.describe('POST /posts', () => {

    test('should create a post with valid data', async ({ qaActor }) => {
      await qaActor.attemptsTo(
        Send.POST().to('/posts').withBody({ title: 'QA Lead', body: 'Automation', userId: 1 }),
      );
      const status = await qaActor.asks(TheLastResponse.status());
      const title = await qaActor.asks(TheLastResponse.bodyField<string>('title'));
      expect(status).toBe(201);
      expect(title).toBe('QA Lead');
    });

    test('should create a post and return an id', async ({ qaActor }) => {
      await qaActor.attemptsTo(
        Send.POST().to('/posts').withBody({ title: 'Test', body: 'Body', userId: 2 }),
      );
      const status = await qaActor.asks(TheLastResponse.status());
      const id = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
      expect(status).toBe(201);
      expect(id).toBeGreaterThan(0);
    });

    test('should return 404 for non-existent post', async ({ qaActor }) => {
      await qaActor.attemptsTo(Send.GET().to('/posts/99999'));
      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(404);
    });

    test('should get posts list', async ({ qaActor }) => {
      await qaActor.attemptsTo(Send.GET().to('/posts'));
      const status = await qaActor.asks(TheLastResponse.status());
      const body = await qaActor.asks(TheLastResponse.body<unknown[]>());
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
    });

    test('should filter posts by userId', async ({ qaActor }) => {
      await qaActor.attemptsTo(
        Send.GET().to('/posts').withParams({ userId: 1 }),
      );
      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(200);
    });

  });

});
