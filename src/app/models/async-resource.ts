import { LoadState } from '../enums/load-state-enum';

export class AsyncResource<T> {
  data: T;
  state: LoadState;
  error: string[] | null;

  constructor(data: T, state: LoadState, error: string[] | null = null) {
    this.data = data;
    this.state = state;
    this.error = error;
  }

  static idle<T>(data: T): AsyncResource<T> {
    return new AsyncResource(data, 'idle');
  }
  static loading<T>(data: T): AsyncResource<T> {
    return new AsyncResource(data, 'loading');
  }
  static success<T>(data: T): AsyncResource<T> {
    return new AsyncResource(data, 'success');
  }
  static empty<T>(data: T): AsyncResource<T> {
    return new AsyncResource(data, 'empty');
  }
  static error<T>(current: AsyncResource<T>, error: string[]): AsyncResource<T> {
    return new AsyncResource(current.data, 'error', error);
  }
  mapData<U>(fn: (data: T) => U): AsyncResource<U> {
    return new AsyncResource(fn(this.data), this.state, this.error);
  }
}
