import type { Actor } from '../actors/Actor';
import type { Interaction } from '../models/screenplay.types';
import { CallAnApi, type RequestOptions } from '../abilities/CallAnApi';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class Send implements Interaction {
  private body: unknown;
  private opts: RequestOptions = {};
  private _path = '';

  private constructor(private readonly method: HttpMethod) {}

  static a(method: HttpMethod): Send { return new Send(method); }
  static GET(): Send    { return new Send('GET'); }
  static POST(): Send   { return new Send('POST'); }
  static PUT(): Send    { return new Send('PUT'); }
  static PATCH(): Send  { return new Send('PATCH'); }
  static DELETE(): Send { return new Send('DELETE'); }

  to(path: string): this {
    this._path = path;
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
    const api = actor.ability<CallAnApi>(CallAnApi);
    const options: RequestOptions = { ...this.opts, data: this.body };

    let response;
    switch (this.method) {
      case 'GET':    response = await api.get(this._path, options);    break;
      case 'POST':   response = await api.post(this._path, options);   break;
      case 'PUT':    response = await api.put(this._path, options);    break;
      case 'PATCH':  response = await api.patch(this._path, options);  break;
      case 'DELETE': response = await api.delete(this._path, options); break;
      default: throw new Error(`Unsupported method: ${this.method}`);
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