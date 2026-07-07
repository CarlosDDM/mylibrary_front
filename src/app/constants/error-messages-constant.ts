import { CrudMessages } from '../models/crud-messages.model';

// Erros de sistema — não pertencem a nenhum model, são falhas de conexão/infra.
export const SYSTEM_ERROR = {
  network: 'Sem conexão com o servidor, verifique sua conexão',
  auth: 'Não foi possivel realizar o login, verifique sua conexão',
  config: 'Erro ao tentar buscar as opções, verifique sua conexão',
} as const;

// Erros por entidade — para adicionar uma nova, copie um bloco e o compilador exige as 4 chaves.
export const ENTITY_ERROR = {
  works: {
    create: 'Erro ao salvar a obra',
    read: 'Erro ao carregar as obras',
    update: 'Erro ao salvar a obra',
    delete: 'Erro ao excluir a obra',
  },
  authors: {
    create: 'Erro ao salvar o autor',
    read: 'Erro ao carregar o autor',
    update: 'Erro ao salvar o autor',
    delete: 'Erro ao excluir o autor',
  },
  franchises: {
    create: 'Erro ao salvar a franquia',
    read: 'Erro ao carregar a franquia',
    update: 'Erro ao salvar a franquia',
    delete: 'Erro ao excluir a franquia',
  },
  illustrators: {
    create: 'Erro ao salvar o ilustrador',
    read: 'Erro ao carregar o ilustrador',
    update: 'Erro ao salvar o ilustrador',
    delete: 'Erro ao excluir o ilustrador',
  },
  series: {
    create: 'Erro ao salvar a série',
    read: 'Erro ao carregar a série',
    update: 'Erro ao salvar a série',
    delete: 'Erro ao excluir a série',
  },
  users: {
    create: 'Erro ao salvar o usuário',
    read: 'Erro ao carregar os usuários',
    update: 'Erro ao salvar o usuário',
    delete: 'Erro ao excluir o usuário',
  },
} satisfies Record<string, CrudMessages>;

// Ações de conta do usuário — não são CRUD de entidade.
export const ACCOUNT_ERROR = {
  changePassword: 'Erro ao alterar a senha',
} as const;
