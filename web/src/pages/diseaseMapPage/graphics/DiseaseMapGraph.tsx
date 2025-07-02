import WebClient from '../../../client/WebClient';

import { useRecoilValue } from 'recoil';
import stateFilterDiseaseMap from '../../../state/stateFilterDiseaseMap';
import { useEffect } from 'react';
import React from 'react';
import { createNodes } from '../../graphics/CreateNodeGraphic';
import { createRelationships } from '../../graphics/CreateLinkGraphic';
import DiseaseMap from '../../../types/DiseaseMap';
import GenericGraph from './GenericGraph';
import Alert from '@mui/material/Alert';

import Label from '../../../components/Form/Label';
import Value from '../../../components/Form/Value';
import Box from '@mui/material/Box';
import RouteIcon from '@mui/icons-material/Route';
import PolylineIcon from '@mui/icons-material/Polyline';
import { HtmlTooltip } from '../../../components/Form/HtmlTooltip';
import Button from '@mui/material/Button';

function DiseaseMapGraph() {
  const filterDiseaseMap = useRecoilValue(stateFilterDiseaseMap);
  const [diseaseMapGraphData, setDiseaseMapGraphData] =
    React.useState<DiseaseMap>();

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        if (filterDiseaseMap != null) {
          const diseaseMapGraphData = await WebClient.getDiseaseMapGraphData(
            filterDiseaseMap.id,
            abortController.signal,
          );
          setDiseaseMapGraphData(diseaseMapGraphData);
        } /*else {
          setDiseaseMapGraphData(undefined);
        }*/
      } catch (error) {
        if (!abortController.signal.aborted) console.error(error);
      }
    })();
    return () => abortController.abort();
  }, [filterDiseaseMap]);

  return (
    <>
      {!diseaseMapGraphData && (
        <Alert severity="warning">Select disease map to show graph.</Alert>
      )}

      {diseaseMapGraphData && diseaseMapGraphData.circuits
        ? Object.entries(diseaseMapGraphData.circuits).map(
            ([pathwayId, circuitData]: [string, any]) => (
              <div key={pathwayId}>
                <Box display="flex" alignItems="center" gap={1}>
                  <RouteIcon fontSize="small" />
                  <Label>Pathway:</Label>
                  <Value>
                    {pathwayId} - {circuitData.name}
                  </Value>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PolylineIcon fontSize="small" />
                  <Label>Num circuits: </Label>
                  <Value>
                    {circuitData.circuit.length}

                    <HtmlTooltip
                      title={
                        <ul style={{ paddingLeft: '1.2em', margin: 0 }}>
                          {Array.isArray(circuitData.circuit)
                            ? circuitData.circuit.map(
                                (item: string, index: number) => (
                                  <li key={index}>{item}</li>
                                ),
                              )
                            : null}
                        </ul>
                      }
                    >
                      <Button>show circuits</Button>
                    </HtmlTooltip>
                  </Value>
                </Box>

                <GenericGraph
                  graphKey={`${pathwayId}`}
                  graph={circuitData.subpathways}
                  createNodes={createNodes}
                  createLinks={createRelationships}
                  createLabelsNodes={undefined}
                />
                <br />
                <br />
              </div>
            ),
          )
        : null}

      {/*diseaseMapGraphData && diseaseMapGraphData.circuits
        ? diseaseMapGraphData.circuits.map(
            (pathwayCircuit: PathwayCircuit, index: number) => (
              <div key={index}>
                <div>{pathwayCircuit.pathway_id}</div>
                {/*pathwayCircuit.pathway_id && (
                  <GenericGraph
                    graphKey={pathwayCircuit.pathway_id} // Pass as a separate prop
                    graph={pathwayCircuit.subpathways}
                    createNodes={createNodes}
                    createLinks={createRelationships}
                    createLabelsNodes={undefined}
                  />
                )}
              </div>
            ),
          )
        : null*/}
    </>
  );
}

export default DiseaseMapGraph;
