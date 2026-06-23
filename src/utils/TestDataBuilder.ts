/**
 * TEST DATA BUILDER
 *
 * Factory methods for generating test data.
 * Uses the Builder pattern for flexible, readable test data creation.
 *
 * @example
 * const user = TestDataBuilder.user().withJob('QA Lead').build();
 * const creds = TestDataBuilder.validCredentials();
 */

export interface UserData {
  name: string;
  job: string;
}

export interface CredentialsData {
  email: string;
  password: string;
}

class UserBuilder {
  private data: UserData = {
    name: 'QA Automation Engineer',
    job: 'Senior QA',
  };

  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withJob(job: string): this {
    this.data.job = job;
    return this;
  }

  build(): UserData {
    return { ...this.data };
  }
}

export class TestDataBuilder {

  static user(): UserBuilder {
    return new UserBuilder();
  }

  static validCredentials(): CredentialsData {
    return {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    };
  }

  static invalidCredentials(): CredentialsData {
    return {
      email: 'invalid@test.com',
      password: 'wrongpassword',
    };
  }

  static incompleteCredentials(): Partial<CredentialsData> {
    return {
      email: 'peter@klaven.com',
      // password missing — triggers 400
    };
  }
}
