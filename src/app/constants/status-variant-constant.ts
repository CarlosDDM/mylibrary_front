import { ChipVariant } from '../shared/components/chip/chip';

export const STATUS_VARIANT: Record<string, ChipVariant> = {
  ongoing: 'info',
  completed: 'success',
  hiatus: 'warning',
  cancelled: 'danger',
};
