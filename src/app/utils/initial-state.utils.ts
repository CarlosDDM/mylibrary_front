import { AsyncResource, LoadState } from '../models/async-resource';

export function loadValue<T>(
  emptyValue: T,
  state: LoadState = 'loading',
  error = null,
): AsyncResource<T> {
  return { data: emptyValue, state, error };
}
