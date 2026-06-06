import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_MESSAGE } from '../constants/error-messages-constant';

export function parseHttpError(err: unknown, fallback: string): string[] {
  // sem conexão com o servidor
  if (!(err instanceof HttpErrorResponse)) {
    return [fallback];
  }

  // erro de rede (status 0 = sem resposta do servidor)
  if (err.status === 0) {
    return [ERROR_MESSAGE.network];
  }

  const body = err.error;

  // backend retornou array de erros
  if (Array.isArray(body?.errors) && body.errors.length > 0) {
    return body.errors;
  }

  // backend retornou mensagem única
  if (typeof body?.message === 'string') {
    return [body.message];
  }

  // fallback genérico
  return [fallback];
}
