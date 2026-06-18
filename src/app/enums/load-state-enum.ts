export enum LoadStateEnum {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Empty = 'empty',
  Error = 'error',
}

export type LoadState = 'idle' | 'loading' | 'success' | 'empty' | 'error';
