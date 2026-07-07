import { HttpErrorResponse } from '@angular/common/http';
import { SYSTEM_ERROR } from '../constants/error-messages-constant';

export function parseHttpError(err: unknown, fallback: string): string[] {
  // sem conexão com o servidor
  if (!(err instanceof HttpErrorResponse)) {
    return [fallback];
  }

  // erro de rede (status 0 = sem resposta do servidor)
  if (err.status === 0) {
    return [SYSTEM_ERROR.network];
  }

  const body = err.error;

  // backend retornou array de erros (errors[] ou message[])
  const errors = body?.errors ?? body?.message;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors;
  }

  // backend retornou mensagem única
  if (typeof body?.message === 'string') {
    return [body.message];
  }

  // fallback genérico
  return [fallback];
}
