import DetailNPathway from '../../types/graphic/DetailNPathway';
import { useEffect, useState } from 'react';
import WebClient from '../../client/WebClient';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import stateSelectedNode from '../../state/stateSelectedNode';

import Gene from '../../types/graphic/Gene';
import NPathway from '../../types/graphic/NPathway';
import NFunction from '../../types/graphic/NFunction';
import Drug from '../../types/graphic/Drug';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import Protein from '../../types/graphic/Protein';
import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import Label from '../../components/Form/Label';
import Value from '../../components/Form/Value';
import GraphData from '../../types/graphic/GraphData';

function DetailNodePathway() {
  const selectedNode = useRecoilValue(stateSelectedNode);
  const [detailSelectedNode, setDetailSelectedNode] =
    useState<DetailNPathway | null>();
  console.log(selectedNode);
  const setSelectedNode = useSetRecoilState(stateSelectedNode);

  function handlerSelectedRelPathway(npathway: NPathway) {
    const nodePath = {
      id: npathway.name,
      labels: ['Pathway'],
      properties: npathway,
      x: npathway.x,
      y: npathway.y,
    };

    setSelectedNode(nodePath);
  }

  // Obtener los datos de la API Flask
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        console.log('----');
        console.log(selectedNode);

        if (selectedNode != null) {
          const graph: GraphData = await WebClient.getNodeDetail(
            selectedNode.properties.id,
            abortController.signal,
          );
          const nodes = graph.nodes;

          const detailSelectedNodeTmp: DetailNPathway = {
            id: selectedNode.properties.id,
            name: selectedNode.properties.name,
            shape: selectedNode.properties?.shape,
            genes: nodes
              ? nodes
                  .filter((n) => n.labels[0] == 'Gene')
                  .map((n) => n.properties as Gene)
              : [],
            drugs: nodes
              ? nodes
                  .filter((n) => n.labels[0] == 'Drug')
                  .map((n) => n.properties as Drug)
              : [],
            proteins: nodes
              ? nodes
                  .filter((n) => n.labels[0] == 'Protein')
                  .map((n) => n.properties as Protein)
              : [],
            npathways: nodes
              ? nodes
                  .filter((n) => n.labels[0] == 'NPathway')
                  .map((n) => n.properties as NPathway)
              : [],
            nfunctions: nodes
              ? nodes
                  .filter((n) => n.labels[0] == 'Function')
                  .map((n) => n.properties as NFunction)
              : [],
          };
          setDetailSelectedNode(detailSelectedNodeTmp);
        } else {
          setDetailSelectedNode(null);
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
  }, [selectedNode]);

  return (
    <>
      {detailSelectedNode ? (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              Selected NPathway:
            </AccordionSummary>
            <AccordionDetails>
              <Label>Id: </Label>
              <Value>
                {detailSelectedNode && <>{detailSelectedNode.id}</>}
              </Value>

              <Label>Name:</Label>
              <Value>
                {detailSelectedNode.shape == 'metabolite' && (
                  <Box
                    component="img"
                    src="/metabolite.png"
                    alt="Metabolite"
                    sx={{
                      width: '1.8rem',
                      paddingRight: '5px',
                    }}
                    title="Metabolite"
                  />
                )}
                {detailSelectedNode && <>{detailSelectedNode.name}</>}
              </Value>
            </AccordionDetails>
          </Accordion>

          {detailSelectedNode &&
            'genes' in detailSelectedNode &&
            detailSelectedNode?.genes &&
            detailSelectedNode?.genes?.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Genes:
                </AccordionSummary>
                <AccordionDetails>
                  {detailSelectedNode &&
                    'genes' in detailSelectedNode &&
                    detailSelectedNode?.genes &&
                    detailSelectedNode?.genes.map((g, i) => (
                      <p key={`p_${i}`}>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ mt: i === 0 ? 0 : 4 }}
                        >
                          <Box
                            component="img"
                            src="/gene.png"
                            alt="Gene"
                            sx={{
                              width: '2rem',
                              paddingRight: '5px',
                            }}
                            title="Gene: EntrezId - Name"
                          />{' '}
                          <Value>
                            <Link
                              title="EntrezId - Nactional Center for Biotechnology Information"
                              href={`https://www.ncbi.nlm.nih.gov/gene/${g.id}`}
                              target="_blank"
                            >
                              {g.id}
                            </Link>
                            {' - '}
                            <Link
                              title="GenerCards"
                              href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${g.name}`}
                              target="_blank"
                            >
                              {g.name}
                            </Link>
                          </Value>
                        </Box>

                        <>
                          <Label>Region: </Label>
                          {g.seq_region_name}:{g.seq_region_start}-
                          {g.seq_region_end}{' '}
                        </>
                        {g.synonyms && (
                          <>
                            <Label>Synonyms:</Label>
                            {g.synonyms.map((synonym, i) => (
                              <Value key={`syn_gen_${i}`}>{synonym}</Value>
                            ))}
                          </>
                        )}
                        <>
                          <Label>EnsembleId: </Label>
                          <Value>
                            <Link
                              title="Ensemble DB (gene)"
                              href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${g.ensemble_id}`}
                              target="_blank"
                            >
                              {g.ensemble_id}
                            </Link>
                          </Value>
                        </>
                        <>
                          <Label>Canonical transcript:</Label>
                          <Value>
                            <Link
                              title="Ensemble DB (transcript)"
                              href={`https://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;g=${g.transcript_stable_id}`}
                              target="_blank"
                            >
                              {g.transcript_stable_id}
                            </Link>
                          </Value>
                        </>
                      </p>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}

          {detailSelectedNode &&
            detailSelectedNode.drugs &&
            detailSelectedNode?.drugs?.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Drugs:
                </AccordionSummary>
                <AccordionDetails>
                  {detailSelectedNode &&
                    detailSelectedNode.drugs &&
                    detailSelectedNode.drugs.map((d: Drug, i) => (
                      <p key={`d_${i}`}>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ mt: i === 0 ? 0 : 4 }}
                        >
                          <Box
                            component="img"
                            src="/drug.png"
                            alt="Drug"
                            sx={{
                              width: '2rem',
                              paddingRight: '5px',
                            }}
                            title="Drug: DrugbankId - Name"
                          />{' '}
                          <Value>
                            <Link
                              title="Drugbank"
                              href={`https://go.drugbank.com/drugs/${d.id}`}
                              target="_blank"
                            >
                              {d.id}
                            </Link>
                          </Value>
                        </Box>

                        <Label>Name:</Label>
                        <Value>{d.name}</Value>
                        <div>
                          <Label>Synonyms:</Label>
                          {d.synonyms.map((synonym, i) => (
                            <Value key={`syn_drug_${i}`}>{synonym}</Value>
                          ))}
                        </div>
                      </p>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}

          {detailSelectedNode &&
            detailSelectedNode.proteins &&
            detailSelectedNode?.proteins?.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Protein:
                </AccordionSummary>
                <AccordionDetails>
                  {detailSelectedNode &&
                    detailSelectedNode.proteins &&
                    detailSelectedNode.proteins.map((p: Protein, i) => (
                      <>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ mt: i === 0 ? 0 : 4 }}
                        >
                          <Box
                            component="img"
                            src="/protein.png"
                            alt="Gene"
                            sx={{
                              width: '2rem',
                              paddingRight: '5px',
                            }}
                            title="Gene: EntrezId - Name"
                          />{' '}
                          <Value>
                            <Link
                              title="Uniprod DB"
                              href={`https://www.uniprot.org/uniprotkb/${p.id}/entry`}
                              target="_blank"
                            >
                              {p.id}
                            </Link>
                          </Value>
                        </Box>

                        <Label>Name:</Label>
                        <Value>{p.name}</Value>

                        <Label>General function:</Label>
                        <Value>{p.general_function}</Value>
                        <div>
                          <Label>External ids: </Label>
                          {p.external_ids.map((ext_id, i) => (
                            <Value key={`ext_id${i}`}>{ext_id}</Value>
                          ))}
                        </div>
                      </>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}

          {detailSelectedNode &&
            detailSelectedNode.nfunctions &&
            detailSelectedNode?.nfunctions?.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Funtions:
                </AccordionSummary>
                <AccordionDetails>
                  {detailSelectedNode &&
                    detailSelectedNode.nfunctions &&
                    detailSelectedNode.nfunctions.map((f: NFunction) => (
                      <> {f.name}</>
                    ))}
                </AccordionDetails>
              </Accordion>
            )}

          {detailSelectedNode &&
            detailSelectedNode.npathways &&
            detailSelectedNode?.npathways?.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Related NPathways:
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {detailSelectedNode &&
                      detailSelectedNode.npathways &&
                      detailSelectedNode.npathways.map((np: NPathway, i) => (
                        <ListItemButton
                          key={`np_${i}`}
                          title="Click to show detail node"
                          onClick={() => handlerSelectedRelPathway(np)}
                        >
                          {np && np.shape && np?.shape == 'metabolite' && (
                            <Box
                              component="img"
                              src="/metabolite.png"
                              alt="Metabolite"
                              sx={{
                                width: '1.8rem',
                                paddingRight: '5px',
                              }}
                              title="Metabolite"
                            />
                          )}
                          <ListItemText primary={np.name} />
                        </ListItemButton>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
        </>
      ) : (
        <p>No node selected</p>
      )}
    </>
  );
}

export default DetailNodePathway;
