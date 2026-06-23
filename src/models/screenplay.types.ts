import type { Actor } from '../actors/Actor';

// ─── Core Screenplay Interfaces ──────────────────────────────────────────────

/**
 * Something an Actor CAN DO (e.g. call APIs, use a browser)
 */
export interface Ability {
  readonly name: string;
}

/**
 * Something an Actor DOES — a single interaction with the system
 * (click a button, call an endpoint, etc.)
 */
export interface Interaction {
  performAs(actor: Actor): Promise<void>;
}

/**
 * A TASK groups multiple Interactions into a meaningful business action
 * (e.g. "register a user" = POST /users + assert 201)
 */
export interface Task {
  performAs(actor: Actor): Promise<void>;
}

/**
 * A QUESTION asks the system for its current state
 * (e.g. "what is the response status?")
 */
export interface Question<T> {
  answeredBy(actor: Actor): Promise<T>;
}

/**
 * Assertion helper — asks a question and asserts the answer
 */
export interface Assertion<T> {
  question: Question<T>;
  matcher: (value: T) => void;
}
