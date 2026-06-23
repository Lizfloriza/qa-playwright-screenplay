import type { Actor } from '../actors/Actor';
import type { Task } from '../models/screenplay.types';
import { Send } from '../interactions/Send';

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface UpdateUserPayload {
  name?: string;
  job?: string;
}

/**
 * TASK: ManageUsers
 *
 * Business-level tasks for user management.
 * Each task groups one or more interactions into a meaningful workflow step.
 *
 * @example
 * await actor.attemptsTo(ManageUsers.create({ name: 'Floriza', job: 'QA Lead' }));
 * await actor.attemptsTo(ManageUsers.getById(1));
 * await actor.attemptsTo(ManageUsers.update(1, { job: 'QA Manager' }));
 * await actor.attemptsTo(ManageUsers.delete(1));
 */
export class ManageUsers {

  static create(payload: CreateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.POST().to('/api/users').withBody(payload),
        );
      },
    };
  }

  static getById(id: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.GET().to(`/api/users/${id}`),
        );
      },
    };
  }

  static getPage(page: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.GET().to('/api/users').withParams({ page }),
        );
      },
    };
  }

  static update(id: number, payload: UpdateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.PUT().to(`/api/users/${id}`).withBody(payload),
        );
      },
    };
  }

  static partialUpdate(id: number, payload: UpdateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.PATCH().to(`/api/users/${id}`).withBody(payload),
        );
      },
    };
  }

  static delete(id: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.DELETE().to(`/api/users/${id}`),
        );
      },
    };
  }
}
