export type LoadState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface AsyncResource<T> {
  data: T;
  state: LoadState;
  error: string | null;
}
