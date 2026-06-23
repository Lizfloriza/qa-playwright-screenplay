import { test, expect } from '../../src/utils/fixtures';
import { ManageUsers } from '../../src/tasks/ManageUsers';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

test.describe('Users API — CRUD', () => {

  test.describe('GET /users', () => {

    test('should list users', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getPage(1));
      const status = await qaActor.asks(TheLastResponse.status());
      const body = await qaActor.asks(TheLastResponse.body<{length: number}>());
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
    });

    test('should return 404 for non-existent user', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getById(99999));
      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(404);
    });

  });

  test.describe('GET /users/:id', () => {

    test('should get user by id', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getById(1));
      const status = await qaActor.asks(TheLastResponse.status());
      const id = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
      expect(status).toBe(200);
      expect(id).toBe(1);
    });

  });

  test.describe('POST /users', () => {

    test('should create a new user', async ({ qaActor }) => {
      const newUser = TestDataBuilder.user()
        .withName('Floriza Crisóstomo')
        .withJob('QA Lead')
        .build();
      await qaActor.attemptsTo(ManageUsers.create(newUser));
      const status = await qaActor.asks(TheLastResponse.status());
      const name = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
      const id = await qaActor.asks(TheLastResponse.bodyField<number>('id'));
      expect(status).toBe(201);
      expect(name).toBe(newUser.name);
      expect(id).toBeGreaterThan(0);
    });

  });

  test.describe('PUT /users/:id', () => {

    test('should fully update a user', async ({ qaActor }) => {
      const updated = TestDataBuilder.user().withName('Updated').withJob('Manager').build();
      await qaActor.attemptsTo(ManageUsers.update(1, updated));
      const status = await qaActor.asks(TheLastResponse.status());
      const name = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
      expect(status).toBe(200);
      expect(name).toBe('Updated');
    });

  });

  test.describe('PATCH /users/:id', () => {

    test('should partially update a user', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.partialUpdate(1, { name: 'Patched' }));
      const status = await qaActor.asks(TheLastResponse.status());
      const name = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
      expect(status).toBe(200);
      expect(name).toBe('Patched');
    });

  });

  test.describe('DELETE /users/:id', () => {

    test('should delete a user and return 200', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.delete(1));
      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(200);
    });

  });

});
