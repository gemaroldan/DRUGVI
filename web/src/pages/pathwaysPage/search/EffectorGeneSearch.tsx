import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import WebClient from '../../../client/WebClient';
import Node from '../../../types/graphic/Node';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import stateFilterPathway from '../../../state/stateFilterPathway';
import stateFilterEffectorGene from '../../../state/stateFilterEffectorGene';
import stateEffectorGenes from '../../../state/stateEffectorGenes';

export default function EffectorGeneSelect() {
  const filterPathway = useRecoilValue(stateFilterPathway);
  //const [effectorsGenes, setEffectorGenes] = React.useState<Node[]>([]);
  const [effectorsGenes, setEffectorGenes] = useRecoilState(stateEffectorGenes);
  const [filterEffectorGene, setFilterEffectorGene] = useRecoilState(
    stateFilterEffectorGene,
  );

  const handleChangeEffectorGene = React.useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: Node | null) => {
      if (value != null && effectorsGenes) {
        const item = effectorsGenes.find(
          (elem: Node) => elem.properties.id === value.properties.id,
        );
        setFilterEffectorGene(item || null);
      } else {
        setFilterEffectorGene(null);
      }
    },
    [effectorsGenes, setFilterEffectorGene],
  );

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        setFilterEffectorGene(null);
        console.log('clear filter effector gene');
        if (filterPathway != null) {
          const genes = await WebClient.getEffectorGenes(
            filterPathway.id,
            abortController.signal,
          );
          setEffectorGenes(genes);
        } else {
          setEffectorGenes([]);
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
  }, [filterPathway, setFilterEffectorGene]);

  return (
    <Autocomplete
      id="lastNode-select"
      sx={{ width: 300 }}
      options={effectorsGenes || []}
      autoHighlight
      value={filterEffectorGene}
      getOptionLabel={(option) => option.properties.name}
      onChange={handleChangeEffectorGene}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a effector gene"
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
