import Grid from '@mui/material/Grid2';
import DetailNodePathway from '../detail/DetailNodePathway';
import DiseaseMapSearch from './search/DiseaseMapSearch';
import DiseaseMapGraph from './graphics/DiseaseMapGraph';
import Typography from '@mui/material/Typography';
import ResizableSidebarLayout from '../../components/Sidebar/ResizableSidebarLayout';
import { useTheme } from '@mui/material';

function DiseaseMapPage() {
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
            <b>Diseases map filters:</b>{' '}
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <DiseaseMapSearch></DiseaseMapSearch>
        </Grid>
        {/*<Grid display="flex" alignItems="center">
          <EffectorGeneSearch></EffectorGeneSearch>
        </Grid>
        <Grid display="flex" alignItems="center">
          <IniEffectorGeneSearch></IniEffectorGeneSearch>
        </Grid>*/}
      </Grid>

      <ResizableSidebarLayout
        sidebarContent={<DetailNodePathway />}
        mainContent={<DiseaseMapGraph />}
      />
    </>
  );
}

export default DiseaseMapPage;
