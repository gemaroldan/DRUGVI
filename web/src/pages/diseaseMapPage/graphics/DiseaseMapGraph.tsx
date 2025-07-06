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
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import DiseaseCircuit from '../../../types/DiseaseCircuit';

function DiseaseMapGraph() {
  const filterDiseaseMap = useRecoilValue(stateFilterDiseaseMap);
  const [diseaseMapGraphData, setDiseaseMapGraphData] =
    React.useState<DiseaseMap>();
  const setSelectedNode = useSetRecoilState(stateSelectedNode);
  const [loading, setLoading] = React.useState<boolean>(false);

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
    if (!diseaseMapGraphData?.diseaseCircuits) return null;

    const circuitData = diseaseMapGraphData?.diseaseCircuits?.[pathwayId];

    if (!circuitData) {
      console.warn(`No se encontró circuitData para pathwayId: ${pathwayId}`);
      return null;
    }
    const transformed = getNPathwayFromCircuitId(item);

    const matchedNode = circuitData.subpathways.nodes.find(
      (node: Node) => node.properties?.id === transformed,
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
          setLoading(true);
          const diseaseMapGraphData = await WebClient.getDiseaseMapGraphData(
            filterDiseaseMap.id,
            abortController.signal,
          );
          setLoading(false);
          setDiseaseMapGraphData(diseaseMapGraphData);
        } else {
          setDiseaseMapGraphData(null as unknown as DiseaseMap);
        }
      } catch (error) {
        setLoading(false);
        if (!abortController.signal.aborted) console.error(error);
      }
    })();
    return () => abortController.abort();
  }, [filterDiseaseMap]);

  return (
    <>
      {!diseaseMapGraphData && !loading && (
        <Alert severity="warning">Select disease map to show graph.</Alert>
      )}

      {loading && <>loading...</>}

      {diseaseMapGraphData && diseaseMapGraphData.diseaseCircuits
        ? Object.entries(diseaseMapGraphData.diseaseCircuits).map(
            ([pathwayId, diseaseCircuit]: [string, DiseaseCircuit]) => (
              <div key={pathwayId}>
                <Box display="flex" alignItems="center" gap={1}>
                  <RouteIcon fontSize="small" />
                  <Label>Pathway:</Label>
                  <Value>
                    {pathwayId} - {diseaseCircuit.name}
                  </Value>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PolylineIcon fontSize="small" />
                  <Label>Num circuits: </Label>
                  <Value>
                    {diseaseCircuit.circuits?.length}

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
                            {Array.isArray(diseaseCircuit.circuits)
                              ? diseaseCircuit.circuits.map(
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
                  graph={diseaseCircuit.subpathways}
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
