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

export class ManageUsers {

  static create(payload: CreateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.POST().to('/users').withBody(payload),
        );
      },
    };
  }

  static getById(id: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.GET().to(`/users/${id}`),
        );
      },
    };
  }

  static getPage(page: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.GET().to('/users').withParams({ page }),
        );
      },
    };
  }

  static update(id: number, payload: UpdateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.PUT().to(`/users/${id}`).withBody(payload),
        );
      },
    };
  }

  static partialUpdate(id: number, payload: UpdateUserPayload): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.PATCH().to(`/users/${id}`).withBody(payload),
        );
      },
    };
  }

  static delete(id: number): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.DELETE().to(`/users/${id}`),
        );
      },
    };
  }
}
