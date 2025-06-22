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
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

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
    <div>
      {!diseaseMapGraphData && (
        <Alert severity="warning">Select disease map to show graph.</Alert>
      )}
      {diseaseMapGraphData && (
        <span>
          {diseaseMapGraphData.id} - {diseaseMapGraphData.name}
        </span>
      )}

      {diseaseMapGraphData && diseaseMapGraphData.circuits
        ? Object.entries(diseaseMapGraphData.circuits).map(
            ([pathwayId, circuitData]: [string, any]) => (
              <div key={pathwayId}>
                <br />
                <br />
                <div> Pathway: {pathwayId}</div>

                <div style={{ whiteSpace: 'pre' }}>
                  Circuits: {circuitData.circuit.length} (
                  {Array.isArray(circuitData.circuit)
                    ? circuitData.circuit.join(', ')
                    : ''}
                  )
                </div>

                <GenericGraph
                  graphKey={`${pathwayId}`}
                  graph={circuitData.subpathways}
                  createNodes={createNodes}
                  createLinks={createRelationships}
                  createLabelsNodes={undefined}
                />
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
    </div>
  );
}

export default DiseaseMapGraph;
