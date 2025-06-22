import * as React from 'react';
import { useSetRecoilState } from 'recoil';
//import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import WebClient from '../../../client/WebClient';
import DiseaseMap from '../../../types/DiseaseMap';
import stateFilterDiseaseMap from '../../../state/stateFilterDiseaseMap';

export default function DiseaseMapSelect() {
  const [diseaseMaps, setDiseasesMaps] = React.useState<DiseaseMap[]>([]);
  const setFilterDiseaseMap = useSetRecoilState(stateFilterDiseaseMap);

  const handleChangeDiseaseMap = React.useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: DiseaseMap | null) => {
      if (value != null) {
        const item =
          diseaseMaps.find((elem: DiseaseMap) => elem.id === value.id) || null;
        setFilterDiseaseMap(item);
      } else {
        setFilterDiseaseMap(null);
      }
    },
    [diseaseMaps, stateFilterDiseaseMap],
  );

  // Get data API Flask
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const diseaseMaps = await WebClient.getDiseaseMaps(
          abortController.signal,
        );
        setDiseasesMaps(diseaseMaps);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log('ERROR: ' + error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Autocomplete
      id="pathway-select"
      sx={{ width: 450 }}
      options={diseaseMaps}
      autoHighlight
      getOptionLabel={(option) => option.id + '-' + option.name}
      onChange={handleChangeDiseaseMap}
      size="small"
      /*renderOption={(props, option) => {
        const { ...optionProps } = props;
        return (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {option.name} - {option.label}
          </Box>
        );
      }}*/
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a disease map"
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            },
          }}
        />
      )}
    />
  );
}
