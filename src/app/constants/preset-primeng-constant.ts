import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const MyPreset = definePreset(Aura, {
  components: {
    toast: {
      root: {
        width: '20rem',
      },
      detail: {
        fontSize: '0.875rem',
      },
      summary: {
        fontSize: '0.875rem',
      },
    },
  },
});
