import type { Actor } from '../actors/Actor';
import type { Interaction } from '../models/screenplay.types';
import { CallAnApi, type RequestOptions } from '../abilities/CallAnApi';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * INTERACTION: Send
 *
 * Sends an HTTP request and stores the response on the Actor.
 *
 * @example
 * await actor.attemptsTo(
 *   Send.a('GET').to('/api/users/1'),
 *   Send.a('POST').to('/api/users').withBody({ name: 'Floriza', job: 'QA Lead' }),
 * );
 */
export class Send implements Interaction {
  private body: unknown;
  private opts: RequestOptions = {};

  private constructor(private readonly method: HttpMethod) {}

  static a(method: HttpMethod): Send { return new Send(method); }
  static GET(): Send    { return new Send('GET'); }
  static POST(): Send   { return new Send('POST'); }
  static PUT(): Send    { return new Send('PUT'); }
  static PATCH(): Send  { return new Send('PATCH'); }
  static DELETE(): Send { return new Send('DELETE'); }

  to(path: string): this {
    this.opts = { ...this.opts };
    (this as unknown as { _path: string })._path = path;
    return this;
  }

  withBody(data: unknown): this {
    this.body = data;
    return this;
  }

  withHeaders(headers: Record<string, string>): this {
    this.opts.headers = { ...this.opts.headers, ...headers };
    return this;
  }

  withParams(params: Record<string, string | number | boolean>): this {
    this.opts.params = { ...this.opts.params, ...params };
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const api = actor.ability(CallAnApi);
    const path = (this as unknown as { _path: string })._path;
    const options: RequestOptions = { ...this.opts, data: this.body };

    let response;
    switch (this.method) {
      case 'GET':    response = await api.get(path, options);    break;
      case 'POST':   response = await api.post(path, options);   break;
      case 'PUT':    response = await api.put(path, options);    break;
      case 'PATCH':  response = await api.patch(path, options);  break;
      case 'DELETE': response = await api.delete(path, options); break;
    }

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers())) {
      headers[key] = value;
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    actor.storeResponse(response.status(), body, headers);
  }
}
