import React, { useState } from 'react';
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { styleModal } from '../../const/Modals';
import DBmetadata from '../../../../types/DBMetadata';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const formatDate = (dateString: number): string => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  return new Date(dateString).toLocaleDateString('en-US', options);
};
interface Props {
  open: boolean;
  closeModal: () => void;
}

export const DatabaseModal: React.FC<Props> = ({ open, closeModal }) => {
  const [databaseMetadata] = useState<DBmetadata[]>([]);
  //const [error, setError] = useState('');

  return (
    <Modal
      aria-labelledby="transition-modal-database"
      aria-describedby="transition-modal-cite-database"
      open={open}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styleModal}>
          <Typography
            id="transition-modal-database"
            variant="h4"
            fontWeight="bold"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <StorageIcon fontSize="large" sx={{ marginRight: '10px' }} />
            Data Base:
          </Typography>
          <p></p>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Version</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Individuals</StyledTableCell>
                  <StyledTableCell align="center">Current</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {databaseMetadata.map((data) => {
                  return (
                    <StyledTableRow key={data.version}>
                      <StyledTableCell component="th" scope="row">
                        {data.version}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(data.date)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.individuals}
                      </StyledTableCell>
                      <StyledTableCell align="center"></StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>
    </Modal>
  );
};
