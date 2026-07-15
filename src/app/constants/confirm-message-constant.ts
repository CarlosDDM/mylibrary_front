import { ConfirmMessages } from '../models/crud-messages.model';

// Mensagens de confirmação por entidade — mesma ideia dos ENTITY_ERROR/ENTITY_SUCCESS:
// copie um bloco pra uma entidade nova. O gênero/artigo (este/esta) fica correto por entidade.
export const ENTITY_CONFIRM = {
  works: { delete: 'Tem certeza que deseja excluir esta obra?' },
  authors: { delete: 'Tem certeza que deseja excluir este autor?' },
  franchises: { delete: 'Tem certeza que deseja excluir esta franquia?' },
  illustrators: { delete: 'Tem certeza que deseja excluir este ilustrador?' },
  series: { delete: 'Tem certeza que deseja excluir esta série?' },
  users: { delete: 'Tem certeza que deseja excluir este usuário?' },
} satisfies Record<string, ConfirmMessages>;

// Confirmações de mudança de cargo (admin sobre um usuário).
export const USER_ROLE_CONFIRM = {
  promote: 'Tem certeza que deseja promover este usuário a administrador?',
  demote: 'Tem certeza que deseja rebaixar este usuário para usuário comum?',
} as const;
