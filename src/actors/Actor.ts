import type { Ability, Interaction, Task, Question } from '../models/screenplay.types';

/**
 * ACTOR — the central agent in the Screenplay pattern.
 *
 * An Actor has Abilities (what it CAN do),
 * performs Tasks and Interactions (what it DOES),
 * and answers Questions (what it KNOWS about the system).
 *
 * @example
 * const floriza = Actor.named('Floriza')
 *   .whoCan(CallAnApi.at('https://api.interbank.pe'));
 *
 * await floriza.attemptsTo(CreateUser.with(userData));
 * const status = await floriza.asks(TheLastResponse.status());
 */
export class Actor {
  private readonly abilities = new Map<string, Ability>();
  private _lastResponseBody: unknown = null;
  private _lastResponseStatus: number = 0;
  private _lastResponseHeaders: Record<string, string> = {};

  private constructor(public readonly name: string) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  whoCan(...abilities: Ability[]): this {
    for (const ability of abilities) {
      this.abilities.set(ability.name, ability);
    }
    return this;
  }

  ability<T extends Ability>(abilityClass: { new(...args: unknown[]): T; abilityName: string }): T {
    const ability = this.abilities.get(abilityClass.abilityName);
    if (!ability) {
      throw new Error(
        `Actor "${this.name}" does not have the ability "${abilityClass.abilityName}". ` +
        `Did you call .whoCan(${abilityClass.abilityName})?`
      );
    }
    return ability as T;
  }

  async attemptsTo(...actions: (Task | Interaction)[]): Promise<void> {
    for (const action of actions) {
      await action.performAs(this);
    }
  }

  async asks<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }

  // ─── Internal state store for API responses ───────────────────────────────
  storeResponse(status: number, body: unknown, headers: Record<string, string>): void {
    this._lastResponseStatus = status;
    this._lastResponseBody = body;
    this._lastResponseHeaders = headers;
  }

  get lastResponseStatus(): number { return this._lastResponseStatus; }
  get lastResponseBody(): unknown { return this._lastResponseBody; }
  get lastResponseHeaders(): Record<string, string> { return this._lastResponseHeaders; }
}
