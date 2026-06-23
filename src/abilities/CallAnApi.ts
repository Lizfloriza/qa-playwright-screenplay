import type { APIRequestContext } from '@playwright/test';
import type { Ability } from '../models/screenplay.types';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

/**
 * ABILITY: CallAnApi
 *
 * Gives an Actor the ability to make HTTP requests using
 * Playwright's APIRequestContext.
 *
 * @example
 * actor.whoCan(CallAnApi.using(request))
 */
export class CallAnApi implements Ability {
  static readonly abilityName = 'CallAnApi';
  readonly name = CallAnApi.abilityName;

  private constructor(
    private readonly requestContext: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  static using(request: APIRequestContext, baseUrl = ''): CallAnApi {
    return new CallAnApi(request, baseUrl);
  }

  async get(path: string, options?: RequestOptions) {
    return this.requestContext.get(`${this.baseUrl}${path}`, {
      headers: options?.headers,
      params: options?.params as Record<string, string>,
      timeout: options?.timeout,
    });
  }

  async post(path: string, options?: RequestOptions) {
    return this.requestContext.post(`${this.baseUrl}${path}`, {
      headers: options?.headers,
      data: options?.data,
      timeout: options?.timeout,
    });
  }

  async put(path: string, options?: RequestOptions) {
    return this.requestContext.put(`${this.baseUrl}${path}`, {
      headers: options?.headers,
      data: options?.data,
      timeout: options?.timeout,
    });
  }

  async patch(path: string, options?: RequestOptions) {
    return this.requestContext.patch(`${this.baseUrl}${path}`, {
      headers: options?.headers,
      data: options?.data,
      timeout: options?.timeout,
    });
  }

  async delete(path: string, options?: RequestOptions) {
    return this.requestContext.delete(`${this.baseUrl}${path}`, {
      headers: options?.headers,
      timeout: options?.timeout,
    });
  }
}
