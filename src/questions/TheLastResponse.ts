import type { Actor } from '../actors/Actor';
import type { Question } from '../models/screenplay.types';

/**
 * QUESTION: TheLastResponse
 *
 * Retrieves data from the last HTTP response stored on the Actor.
 *
 * @example
 * const status = await actor.asks(TheLastResponse.status());
 * const body   = await actor.asks(TheLastResponse.body<UserResponse>());
 * const field  = await actor.asks(TheLastResponse.bodyField<string>('data.first_name'));
 */
export class TheLastResponse {

  static status(): Question<number> {
    return {
      answeredBy: async (actor: Actor) => actor.lastResponseStatus,
    };
  }

  static body<T = unknown>(): Question<T> {
    return {
      answeredBy: async (actor: Actor) => actor.lastResponseBody as T,
    };
  }

  static bodyField<T = unknown>(path: string): Question<T> {
    return {
      answeredBy: async (actor: Actor) => {
        const body = actor.lastResponseBody as Record<string, unknown>;
        return path.split('.').reduce<unknown>((obj, key) => {
          if (obj && typeof obj === 'object' && key in obj) {
            return (obj as Record<string, unknown>)[key];
          }
          throw new Error(`Path "${path}" not found in response body`);
        }, body) as T;
      },
    };
  }

  static header(name: string): Question<string> {
    return {
      answeredBy: async (actor: Actor) => {
        const value = actor.lastResponseHeaders[name.toLowerCase()];
        if (!value) throw new Error(`Header "${name}" not found in response`);
        return value;
      },
    };
  }
}
