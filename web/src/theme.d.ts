import '@mui/material/Button';

import {
  TypographyVariantsOptions,
  TypographyVariants,
} from '@mui/material/styles';

// Buttons
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    menuButton: true;
  }
}
