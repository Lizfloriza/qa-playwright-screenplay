import type { Actor } from '../actors/Actor';
import type { Task } from '../models/screenplay.types';
import { Send } from '../interactions/Send';

export interface Credentials {
  email: string;
  password: string;
}

/**
 * TASK: Authenticate
 *
 * Handles authentication flows: login and registration.
 *
 * @example
 * await actor.attemptsTo(Authenticate.as({ email: 'eve.holt@reqres.in', password: 'pistol' }));
 * await actor.attemptsTo(Authenticate.register({ email: 'floriza@test.com', password: 'secure123' }));
 */
export class Authenticate {

  static as(credentials: Credentials): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.POST().to('/api/login').withBody(credentials),
        );
      },
    };
  }

  static register(credentials: Credentials): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.POST().to('/api/register').withBody(credentials),
        );
      },
    };
  }

  static failToLoginWith(credentials: Partial<Credentials>): Task {
    return {
      performAs: async (actor: Actor) => {
        await actor.attemptsTo(
          Send.POST().to('/api/login').withBody(credentials),
        );
      },
    };
  }
}
