export interface CrudMessages {
  create: string;
  read: string;
  update: string;
  delete: string;
}

// Reads não geram toast de sucesso, então mensagens de sucesso só cobrem as mutações.
export type MutationMessages = Omit<CrudMessages, 'read'>;

// Mensagens de confirmação (diálogo antes de uma ação destrutiva).
export interface ConfirmMessages {
  delete: string;
}
