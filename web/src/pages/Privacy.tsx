import React from 'react';
import Config from '../config/Config';
import {
  Box,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
function Privacy() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        p: 4,
        minHeight: '100vh',
      }}
    >
      <Container sx={{ py: 5, flexGrow: 1 }}>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Privacy and data protection {Config.APP.ABR}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Purpose of the system
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            This interactive web application is designed to visualize metabolic
            pathways related to genes, diseases, and drugs, in order to identify
            potential drug repurposing strategies. The viewer integrates
            information from public biomedical databases: DrugBank, KEGG
            PATHWAY, DisGeNET/DEMxLM, Ensembl, and hiPathia.
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Data Source
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            During the development of this application, exclusively public,
            structured, and anonymized biomedical data was processed. Under no
            circumstances was personal, clinical, or identifying information
            accessed, stored, or processed. For data from private sources, a
            corresponding request has been made, detailing that the information
            will be used for academic purposes. Table 1 summarizes the type of
            information obtained, as well as the source and its license for
            use.{' '}
          </Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type of information</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Personal data?</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>License to use</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Drug</TableCell>
              <TableCell>
                <a
                  title="DrugBank"
                  href="https://go.drugbank.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/logos/drugbank.png" alt="DrugBank" width={100} />
                </a>
              </TableCell>
              <TableCell>
                {' '}
                <Link
                  title="DrugBank"
                  href="https://go.drugbank.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DrugBank
                </Link>
              </TableCell>

              <TableCell>No</TableCell>
              <TableCell> 5.1.13 - January 2, 2025</TableCell>
              <TableCell>Academic use (requires attribution)</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Gene-disease association</TableCell>
              <TableCell>
                <a
                  title="DEMxLM"
                  href="https://github.com/loucerac/drexml"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DRExM³L
                </a>
              </TableCell>
              <TableCell>
                <Link
                  title="DEMxLM"
                  href="https://github.com/loucerac/drexml"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DRExM³L
                </Link>
              </TableCell>

              <TableCell>No</TableCell>
              <TableCell>v1.1.3 - Aug 23, 2024 </TableCell>
              <TableCell>Free access with attribution</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Gene annotation</TableCell>
              <TableCell>
                <a
                  title="Ensembl"
                  href="https://www.ensembl.org/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/logos/ensembl.png" alt="Ensembl" width={100} />
                </a>
              </TableCell>
              <TableCell>
                <Link
                  title="Ensembl"
                  href="https://www.ensembl.org/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ensembl
                </Link>
              </TableCell>

              <TableCell>No</TableCell>
              <TableCell>114, May 2025</TableCell>
              <TableCell>open license (EMBL-EBI)</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Gene annotation</TableCell>
              <TableCell>
                <a
                  title="HUGO Gene Nomenclature Committee"
                  href="https://www.genenames.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    style={{ backgroundColor: '#036' }}
                    src="/logos/hgnc.svg"
                    alt="HUGO Gene Nomenclature Committee"
                    width={100}
                  />
                </a>
              </TableCell>
              <TableCell>
                <Link
                  title="HUGO Gene Nomenclature Committee"
                  href="https://www.genenames.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HGNC
                </Link>
              </TableCell>
              <TableCell>No</TableCell>
              <TableCell>May 13, 2025</TableCell>
              <TableCell>open license (EMBL-EBI)</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Metabolic pathways</TableCell>
              <TableCell>
                <a
                  title="KEGG"
                  href="https://www.kegg.jp/kegg/pathway.html#disease"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/logos/kegg128.gif" alt="KEGG" width={100} />
                </a>
              </TableCell>
              <TableCell>
                <Link
                  title="KEGG"
                  href="https://www.kegg.jp/kegg/pathway.html#disease"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KEGG
                </Link>
              </TableCell>
              <TableCell>No</TableCell>
              <TableCell>release 114 - April, 2025</TableCell>
              <TableCell>Subscription required for commercial use</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Metabolic pathways</TableCell>
              <TableCell>
                <a
                  title="hiPathia"
                  href="http://hipathia.babelomics.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/logos/hiPathia.png" alt="hiPathia" width={100} />
                </a>
              </TableCell>
              <TableCell>
                <Link
                  title="hiPathia"
                  href="http://hipathia.babelomics.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  hiPathia
                </Link>
              </TableCell>
              <TableCell>No</TableCell>
              <TableCell>version 2.13.1 - Jul 27,2022 </TableCell>
              <TableCell>GPL-3.0 (free software)</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <em>Table 1: Data source table</em>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <br />

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Data Operations
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            The operations performed on the data are exclusively for data
            visualization:
            <br />• Querying, loading, and associating stored structured data.{' '}
            <br />• Visualization using interactive graphics in a web
            environment. <br />• No automated decision-making or storage of
            sensitive data is performed.
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Applicable legal framework
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="subtitle1" mb={3}>
            - General Data Protection Regulation (GDPR)
          </Typography>
          <Typography variant="body1" mb={3}>
            <p>
              Although personal data is not processed, it complies with European
              data protection regulations: the data is anonymized, since
              statistical data or data previously processed by other public
              sources are used. Furthermore, according to Article 9.2.j, the
              processing of sensitive data for scientific purposes is permitted,
              provided that appropriate safeguards are applied.{' '}
            </p>
          </Typography>
          <Typography variant="subtitle1" mb={3}>
            - Spanish Science and Technology Law
          </Typography>
          <Typography variant="body1" mb={3}>
            <p>
              This visualization, as well as the public sources used, are
              aligned with Article 37 of the law, which establishes the
              obligation to provide open access and cite the source of the data.
            </p>
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Due Diligence Measures and Guarantees
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            To ensure compliance with the GDPR and Spanish legislation: <br /> •
            It has been verified that no personally identifiable data is used.
            <br /> • The source, license, and type of data processed are
            documented in Table 1 Data Source. Gema Roldán González Visualizer
            for Drug Discovery and Repositioning 39 <br /> • The visualizer only
            allows the visualization of anonymized or simulated data. <br /> •
            The source code and results will be published under a non-commercial
            license compatible with academic research (CC BY-NC 4.0).
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Legal notice or disclaimer{' '}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            The application developed in this master&apos;s thesis does not
            guarantee or assume any legal responsibility for the accuracy,
            completeness, or usefulness of the results provided. Its use is
            intended solely for academic and research purposes. It should not be
            used for medical, diagnostic, or therapeutic decisions.
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Risk Assessment
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            Since data processing does not involve personal information or
            decision-making affecting individuals, the risk to the rights and
            freedoms of data subjects is considered low. However, a preventive
            and responsible approach is adopted, compatible with the principle
            of &quot;privacy by design&quot;.
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="h5" gutterBottom>
            Summary
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            The developed viewer complies with European and national regulations
            regarding research and data protection. No personal data is
            processed, and all sources and operations are documented, ensuring
            transparency, scientific reproducibility, and compliance with the
            open access principles defined by the current legal framework.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Privacy;
