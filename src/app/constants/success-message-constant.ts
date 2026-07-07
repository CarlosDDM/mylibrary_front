import { MutationMessages } from '../models/crud-messages.model';

// Sucesso por entidade — mesma ideia do ENTITY_ERROR: copie um bloco e preencha as 3 mutações.
export const ENTITY_SUCCESS = {
  works: {
    create: 'Sucesso na criação da obra',
    update: 'Obra atualizada com sucesso',
    delete: 'Obra excluída com sucesso',
  },
  authors: {
    create: 'Sucesso na criação do autor',
    update: 'Autor atualizado com sucesso',
    delete: 'Autor excluído com sucesso',
  },
  franchises: {
    create: 'Sucesso na criação da franquia',
    update: 'Franquia atualizada com sucesso',
    delete: 'Franquia excluída com sucesso',
  },
  illustrators: {
    create: 'Sucesso na criação do ilustrador',
    update: 'Ilustrador atualizado com sucesso',
    delete: 'Ilustrador excluído com sucesso',
  },
  series: {
    create: 'Sucesso na criação da série',
    update: 'Série atualizada com sucesso',
    delete: 'Série excluída com sucesso',
  },
  users: {
    create: 'Sucesso na criação do usuário',
    update: 'Usuário atualizado com sucesso',
    delete: 'Usuário excluído com sucesso',
  },
} satisfies Record<string, MutationMessages>;

// Ações de conta do usuário — não são CRUD de entidade.
export const ACCOUNT_SUCCESS = {
  changePassword: 'Senha alterada com sucesso',
} as const;
