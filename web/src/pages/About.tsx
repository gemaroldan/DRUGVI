import React from 'react';
import Config from '../config/Config';
import { Box, Container, Typography, useTheme } from '@mui/material';
function About() {
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
            About {Config.APP.ABR}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="body1" mb={3}>
            The <b>{Config.APP.TITLE}</b> also known by the abbreviations{' '}
            <b>{Config.APP.ABR}</b>
            project originated as part of a Master&apos;s Thesis in the
            Master&apos;s Program in Big Data Analysis and Visualization. Its
            goal is to provide an interactive visualization tool focused on drug
            repositioning. This web application allows users to visually explore
            relationships between genes, diseases, and pharmacological
            compounds, facilitating the interpretation of complex computational
            analysis results.
          </Typography>

          <Typography variant="body1" mb={3}>
            It is designed to support biomedical researchers and professionals,
            especially those without programming expertise, in identifying
            potential connections among biological entities that may indicate
            new therapeutic uses for existing drugs.
          </Typography>

          <Typography variant="body1" mb={3}>
            The tool integrates technologies such as React, TypeScript, D3.js,
            Flask (Python), and Neo4j to deliver a responsive, visually rich
            experience. It relies on a structured knowledge database sourced
            from Ensembl, HGNC, KEGG, and DrugBank.
          </Typography>

          <Typography variant="body1" mb={3}>
            Beyond its academic contribution, this project was developed in
            collaboration with the Department of Personalized Medicine to meet
            the real-world need for accessible tools that support the analysis
            and interpretation of biomedical data.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default About;
