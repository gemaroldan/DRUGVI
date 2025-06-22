import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Label = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 400,
  color: theme.palette.text.secondary,
}));

export default Label;
