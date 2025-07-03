import WebClient from '../../../client/WebClient';

import { useRecoilValue, useSetRecoilState } from 'recoil';
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
import Node from '../../../types/graphic/Node';
import stateSelectedNode from '../../../state/stateSelectedNode';
import NPathway from '../../../types/graphic/NPathway';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemText from '@mui/material/ListItemText/ListItemText';

function DiseaseMapGraph() {
  const filterDiseaseMap = useRecoilValue(stateFilterDiseaseMap);
  const [diseaseMapGraphData, setDiseaseMapGraphData] =
    React.useState<DiseaseMap>();
  const setSelectedNode = useSetRecoilState(stateSelectedNode);

  const getNPathwayFromCircuitId = (circuitId: string): string => {
    if (!circuitId.startsWith('P.hsa')) {
      return circuitId;
    }
    const parts: string[] = circuitId.replace('P.hsa', '').split('.');
    if (parts.length === 0) return '';

    const main: string = parts[0];
    const rest: string[] = parts.slice(1);

    let transformed: string = `N-hsa${main}`;
    if (rest.length > 0) {
      transformed += `-${rest[0]}`;
    }
    if (rest.length > 1) {
      transformed += ` ${rest.slice(1).join(' ')}`;
    }

    return transformed;
  };

  const findPathwayByNodeName = (
    pathwayId: string,
    item: string,
  ): Node | null => {
    if (!diseaseMapGraphData?.circuits) return null;

    const circuitData = diseaseMapGraphData?.circuits?.[pathwayId];

    if (!circuitData) {
      console.warn(`No se encontró circuitData para pathwayId: ${pathwayId}`);
      return null;
    }
    const transformed = getNPathwayFromCircuitId(item);

    const matchedNode = circuitData.subpathways.nodes.find(
      (node: any) => node.properties?.id === transformed,
    );

    return matchedNode || null;
  };

  function handlerSelectedRelPathway(pathwayId: string, item: string) {
    const nodePath =
      item != null ? findPathwayByNodeName(pathwayId, item) : null;

    setSelectedNode(nodePath);
  }

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
                        <>
                          <List
                            sx={{
                              margin: 0,
                              listStyleType: 'none',
                              maxHeight: '250px',
                              overflowY: 'auto',
                              padding: 0,
                            }}
                            component="ul"
                          >
                            {Array.isArray(circuitData.circuit)
                              ? circuitData.circuit.map(
                                  (item: string, index: number) => (
                                    <ListItem
                                      key={index}
                                      disablePadding
                                      component="li"
                                      title="Click to show detail node"
                                      onClick={() =>
                                        handlerSelectedRelPathway(
                                          pathwayId,
                                          item,
                                        )
                                      }
                                      sx={{ cursor: 'pointer' }}
                                    >
                                      <ListItemText primary={item} />
                                    </ListItem>
                                  ),
                                )
                              : null}
                          </List>
                        </>
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
    </>
  );
}

export default DiseaseMapGraph;
