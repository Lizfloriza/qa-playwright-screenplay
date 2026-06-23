import { test, expect } from '../../src/utils/fixtures';
import { ManageUsers } from '../../src/tasks/ManageUsers';
import { TheLastResponse } from '../../src/questions/TheLastResponse';
import { TestDataBuilder } from '../../src/utils/TestDataBuilder';

/**
 * USER API TESTS
 * Endpoint: https://reqres.in/api/users
 *
 * Demonstrates full CRUD coverage using Screenplay pattern:
 * Actor → Task → Interaction → Question
 */

test.describe('Users API — CRUD', () => {

  test.describe('GET /api/users', () => {

    test('should list users on page 1', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getPage(1));

      const status = await qaActor.asks(TheLastResponse.status());
      const page   = await qaActor.asks(TheLastResponse.bodyField<number>('page'));
      const data   = await qaActor.asks(TheLastResponse.bodyField<unknown[]>('data'));

      expect(status).toBe(200);
      expect(page).toBe(1);
      expect(data.length).toBeGreaterThan(0);
    });

    test('should list users on page 2', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getPage(2));

      const status = await qaActor.asks(TheLastResponse.status());
      const page   = await qaActor.asks(TheLastResponse.bodyField<number>('page'));

      expect(status).toBe(200);
      expect(page).toBe(2);
    });

    test('should return 404 for non-existent user', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getById(999));

      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(404);
    });

  });

  test.describe('GET /api/users/:id', () => {

    test('should get user by id', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.getById(2));

      const status    = await qaActor.asks(TheLastResponse.status());
      const userId    = await qaActor.asks(TheLastResponse.bodyField<number>('data.id'));
      const userEmail = await qaActor.asks(TheLastResponse.bodyField<string>('data.email'));

      expect(status).toBe(200);
      expect(userId).toBe(2);
      expect(userEmail).toContain('@');
    });

  });

  test.describe('POST /api/users', () => {

    test('should create a new user', async ({ qaActor }) => {
      const newUser = TestDataBuilder.user()
        .withName('Floriza Crisóstomo')
        .withJob('QA Lead')
        .build();

      await qaActor.attemptsTo(ManageUsers.create(newUser));

      const status    = await qaActor.asks(TheLastResponse.status());
      const name      = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
      const job       = await qaActor.asks(TheLastResponse.bodyField<string>('job'));
      const createdAt = await qaActor.asks(TheLastResponse.bodyField<string>('createdAt'));
      const id        = await qaActor.asks(TheLastResponse.bodyField<string>('id'));

      expect(status).toBe(201);
      expect(name).toBe(newUser.name);
      expect(job).toBe(newUser.job);
      expect(createdAt).toBeTruthy();
      expect(id).toBeTruthy();
    });

    test('should create user with default data', async ({ qaActor }) => {
      const defaultUser = TestDataBuilder.user().build();

      await qaActor.attemptsTo(ManageUsers.create(defaultUser));

      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(201);
    });

  });

  test.describe('PUT /api/users/:id', () => {

    test('should fully update a user', async ({ qaActor }) => {
      const updatedData = TestDataBuilder.user()
        .withName('Floriza Updated')
        .withJob('QA Manager')
        .build();

      await qaActor.attemptsTo(ManageUsers.update(2, updatedData));

      const status    = await qaActor.asks(TheLastResponse.status());
      const name      = await qaActor.asks(TheLastResponse.bodyField<string>('name'));
      const updatedAt = await qaActor.asks(TheLastResponse.bodyField<string>('updatedAt'));

      expect(status).toBe(200);
      expect(name).toBe(updatedData.name);
      expect(updatedAt).toBeTruthy();
    });

  });

  test.describe('PATCH /api/users/:id', () => {

    test('should partially update a user', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.partialUpdate(2, { job: 'Senior QA Lead' }));

      const status = await qaActor.asks(TheLastResponse.status());
      const job    = await qaActor.asks(TheLastResponse.bodyField<string>('job'));

      expect(status).toBe(200);
      expect(job).toBe('Senior QA Lead');
    });

  });

  test.describe('DELETE /api/users/:id', () => {

    test('should delete a user and return 204', async ({ qaActor }) => {
      await qaActor.attemptsTo(ManageUsers.delete(2));

      const status = await qaActor.asks(TheLastResponse.status());
      expect(status).toBe(204);
    });

  });

});
