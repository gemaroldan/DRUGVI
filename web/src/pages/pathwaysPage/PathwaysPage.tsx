import Grid from '@mui/material/Grid2';

import PathwaySearch from './search/PathwaySearch';
import EffectorGeneSearch from './search/EffectorGeneSearch';
import IniEffectorGeneSearch from './search/IniEffectorGeneSearch';
import Graphic from '../graphics/Graphic';
import DetailNodePathway from '../detail/DetailNodePathway';
import ResizableSidebarLayout from '../../components/Sidebar/ResizableSidebarLayout';
import { Typography, useTheme } from '@mui/material';

function PathwaysPage() {
  const theme = useTheme();

  return (
    <>
      <Grid
        container
        spacing={2}
        minHeight={70}
        sx={{
          bgcolor: theme.palette.background.default,
          paddingLeft: '2rem',
        }}
      >
        <Grid display="flex" alignItems="center">
          <Typography variant="body2">
            <b>Pathways Filters:</b>{' '}
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <PathwaySearch></PathwaySearch>
        </Grid>
        <Grid display="flex" alignItems="center">
          <EffectorGeneSearch></EffectorGeneSearch>
        </Grid>
        <Grid display="flex" alignItems="center">
          <IniEffectorGeneSearch></IniEffectorGeneSearch>
        </Grid>
      </Grid>

      <ResizableSidebarLayout
        sidebarContent={<DetailNodePathway />}
        mainContent={<Graphic />}
      />
    </>
  );
}

export default PathwaysPage;
