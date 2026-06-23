import { test, expect } from '../../src/utils/fixtures';
import { Authenticate } from '../../src/tasks/Authenticate';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

/**
 * AUTH API TESTS
 * Covers: login success, login failure, register success, register failure
 * Demonstrates negative testing and error handling with Screenplay
 */

test.describe('Auth API', () => {

  test.describe('POST /api/login', () => {

    test('should login with valid credentials and return token', async ({ qaActor }) => {
      const creds = TestDataBuilder.validCredentials();
      await qaActor.attemptsTo(Authenticate.as(creds));

      const status = await qaActor.asks(TheLastResponse.status());
      const token  = await qaActor.asks(TheLastResponse.bodyField<string>('token'));

      expect(status).toBe(200);
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(10);
    });

    test('should return 400 when password is missing', async ({ guestActor }) => {
      await guestActor.attemptsTo(
        Authenticate.failToLoginWith(TestDataBuilder.incompleteCredentials()),
      );

      const status = await guestActor.asks(TheLastResponse.status());
      const error  = await guestActor.asks(TheLastResponse.bodyField<string>('error'));

      expect(status).toBe(400);
      expect(error).toContain('Missing password');
    });

    test('should return 400 with invalid credentials', async ({ guestActor }) => {
      await guestActor.attemptsTo(
        Authenticate.as(TestDataBuilder.invalidCredentials()),
      );

      const status = await guestActor.asks(TheLastResponse.status());
      expect(status).toBe(400);
    });

  });

  test.describe('POST /api/register', () => {

    test('should register successfully and return id + token', async ({ qaActor }) => {
      const creds = TestDataBuilder.validCredentials();
      await qaActor.attemptsTo(Authenticate.register(creds));

      const status = await qaActor.asks(TheLastResponse.status());
      const id     = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
      const token  = await qaActor.asks(TheLastResponse.bodyField<string>('token'));

      expect(status).toBe(200);
      expect(id).toBeGreaterThan(0);
      expect(token).toBeTruthy();
    });

    test('should return 400 when registering without password', async ({ guestActor }) => {
      await guestActor.attemptsTo(
        Authenticate.register({ email: 'floriza@test.com', password: '' }),
      );

      const status = await guestActor.asks(TheLastResponse.status());
      expect(status).toBe(400);
    });

  });

});
