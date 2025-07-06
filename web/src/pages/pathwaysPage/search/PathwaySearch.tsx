import * as React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import WebClient from '../../../client/WebClient';
import Pathway from '../../../types/Pathway';
import stateFilterPathway from '../../../state/stateFilterPathway';
import statePathways from '../../../state/statePathways';
import stateSelectedNode from '../../../state/stateSelectedNode';

export default function PathwaySelect() {
  //const [pathways, setPathways] = React.useState<Pathway[]>([]);
  const [pathways, setPathways] = useRecoilState(statePathways);
  const [filterPathway, setFilterPathway] = useRecoilState(stateFilterPathway);
  const setSelectedNode = useSetRecoilState(stateSelectedNode);

  useEffect(() => {
    setSelectedNode(null);
  }, []);

  const handleChangePathway = React.useCallback(
    (event: React.SyntheticEvent<Element, Event>, value: Pathway | null) => {
      if (value && pathways) {
        const item = pathways.find((elem: Pathway) => elem.name === value.name);
        setFilterPathway(item || null);
      } else {
        setFilterPathway(null);
        setSelectedNode(null);
      }
    },
    [pathways, setFilterPathway],
  );

  // Get data API Flask
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        if (pathways == null) {
          const pathwaysSearch = await WebClient.getPathways(
            abortController.signal,
          );
          setPathways(pathwaysSearch);
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
  }, []);

  return (
    <Autocomplete
      id="pathway-select"
      sx={{ width: 450 }}
      options={pathways || []}
      autoHighlight
      value={filterPathway}
      getOptionLabel={(option) => option.id + ' - ' + option.name}
      onChange={handleChangePathway}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a pathway"
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
