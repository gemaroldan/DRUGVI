import * as React from 'react';
//import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import WebClient from '../../../client/WebClient';
import Node from '../../../types/graphic/Node';
import { useRecoilState, useRecoilValue } from 'recoil';
import stateFilterPathway from '../../../state/stateFilterPathway';
import stateFilterIniEffectorGene from '../../../state/stateFilterIniEffectorGene';
import stateFilterEffectorGene from '../../../state/stateFilterEffectorGene';

export default function IniEffectorGeneSelect() {
  const filterPathway = useRecoilValue(stateFilterPathway);
  const effectorGene = useRecoilValue(stateFilterEffectorGene);

  const [iniEffectorsGenes, setIniEffectorGenes] = React.useState<Node[]>([]);
  const [filterIniEffectorGene, setFilterIniEffectorGene] = useRecoilState(
    stateFilterIniEffectorGene,
  );

  const handleChangeIniEffectorGene = React.useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: Node | null) => {
      if (value != null) {
        const item =
          iniEffectorsGenes.find(
            (elem: Node) => elem.properties.id === value.properties.id,
          ) || null;
        setFilterIniEffectorGene(item);
      } else {
        setFilterIniEffectorGene(null);
      }
    },
    [iniEffectorsGenes, setFilterIniEffectorGene],
  );

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        if (filterPathway != null && effectorGene != null) {
          const genes = await WebClient.getIniEffectorGenes(
            filterPathway.id,
            effectorGene.properties.id,
            abortController.signal,
          );
          setIniEffectorGenes(genes);
        } else {
          setIniEffectorGenes([]);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.log('ERROR: ' + error);
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [effectorGene]);

  useEffect(() => {
    //console.log(
    //  'clear filter effector filterIniEffectorGene',
    //  filterIniEffectorGene,
    //);
    if (filterIniEffectorGene != null) {
      setFilterIniEffectorGene(null);
    }
  }, [iniEffectorsGenes]);

  return (
    <Autocomplete
      id="iniNode-select"
      sx={{ width: 300 }}
      options={iniEffectorsGenes || []}
      autoHighlight
      value={filterIniEffectorGene}
      getOptionLabel={(option) => option.properties.name}
      onChange={handleChangeIniEffectorGene}
      size="small"
      /*renderOption={(props, option) => {
        const { ...optionProps } = props;
        return (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            {option.properties.name}
          </Box>
        );
      }}*/
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a initial for effector gene"
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
