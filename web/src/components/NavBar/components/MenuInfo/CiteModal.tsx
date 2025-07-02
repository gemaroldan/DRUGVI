/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {
  Alert,
  Backdrop,
  Box,
  Fade,
  IconButton,
  Link,
  Modal,
  Typography,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { styleModal } from '../../const/Modals';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
  open: boolean;
  closeModal: () => void;
}

export const CiteModal: React.FC<Props> = ({ open, closeModal }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-cite"
      aria-describedby="transition-modal-cite-description"
      open={open}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            ...styleModal,
            textAlign: 'justify',
            maxHeight: '80vh',
            position: 'relative',

            maxWidth: '700px',
            display: 'flex',
            flexDirection: 'column',

            overflow: 'hidden',
          }}
        >
          {/* Botón X arriba a la derecha */}
          <IconButton
            onClick={closeModal}
            title="Close"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <p>
            <Typography
              id="transition-modal-cite"
              variant="h4"
              fontWeight="bold"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <FormatQuoteIcon fontSize="large" sx={{ marginRight: '10px' }} />
              How to cite:
            </Typography>
          </p>

          <Box
            sx={{
              overflowY: 'auto',
              paddingRight: 2,
              pr: 3,
              flex: 1,
            }}
          >
            <Typography id="transition-modal-cite-description" variant="body2">
              <p>
                If you use the <b>KEGG</b>, you must acknowledge the project by
                citing the publication:
              </p>
              <p>
                <Alert
                  severity="warning"
                  icon={<ContentCopyIcon fontSize="inherit" />}
                >
                  Kanehisa M, Goto S. KEGG: kyoto encyclopedia of genes and
                  genomes. Nucleic Acids Res. 2000 Jan 1;28(1):27-30. doi:
                  {'  '}
                  <Link
                    href="https://10.1093/nar/28.1.27"
                    title="Genome-scale mechanistic modeling of signaling pathways made easy: A bioconductor/cytoscape/web server framework for the analysis of omic data"
                    underline="hover"
                    target="_blank"
                  >
                    10.1093/nar/28.1.27
                  </Link>
                  . PMID: 10592173; PMCID: PMC102409.
                </Alert>
              </p>
              <p>
                If you use the <b>drexml package</b>, you must acknowledge the
                project by citing the publication:
              </p>
              <p>
                <Alert
                  severity="warning"
                  icon={<ContentCopyIcon fontSize="inherit" />}
                >
                  Esteban-Medina, M., de la Oliva Roque, V. M., Herráiz-Gil, S.,
                  Peña-Chilet, M., Dopazo, J., & Loucera, C. (2024). drexml: A
                  command line tool and Python package for drug repurposing.
                  Computational and Structural Biotechnology Journal, 23,
                  1129-1143.
                  {'  '}
                  <Link
                    href="https://doi.org/10.1016/j.csbj.2024.02.027"
                    title="drexml: A command line tool and Python package for drug repurposing"
                    underline="hover"
                    target="_blank"
                  >
                    https://doi.org/10.1016/j.csbj.2024.02.027
                  </Link>
                  .
                </Alert>
              </p>
              <p>
                If you use the <b>hiPathia</b>, you must acknowledge the project
                by citing the publication:
              </p>
              <p>
                <Alert
                  severity="warning"
                  icon={<ContentCopyIcon fontSize="inherit" />}
                >
                  Rian, K., Hidalgo, M. R., Çubuk, C., Falco, M. M., Loucera,
                  C., Esteban-Medina, M., Alamo- Alvarez, I., Peña-Chilet, M., &
                  Dopazo, J. (2021). Genome-scale mechanistic modeling of
                  signaling pathways made easy: A bioconductor/cytoscape/web
                  server framework Gema Roldán González Visualizador para el
                  descubrimiento y el reposicionamiento de fármacos 35 for the
                  analysis of omic data. Computational and Structural
                  Biotechnology Journal, 19, 2968-2978.
                  {'  '}
                  <Link
                    href="https://doi.org/10.1016/j.csbj.2021.05.022"
                    title="Genome-scale mechanistic modeling of signaling pathways made easy: A bioconductor/cytoscape/web server framework for the analysis of omic data"
                    underline="hover"
                    target="_blank"
                  >
                    https://doi.org/10.1016/j.csbj.2021.05.022
                  </Link>
                </Alert>
              </p>
              <p>
                If you use the <b>Drugbank dataset</b>, you must acknowledge the
                project by citing the publication:
              </p>
              <p>
                <Alert
                  severity="warning"
                  icon={<ContentCopyIcon fontSize="inherit" />}
                >
                  Craig Knox, Mike Wilson, Christen M Klinger, Mark Franklin,
                  Eponine Oler, Alex Wilson, Allison Pon, Jordan Cox, Na Eun
                  (Lucy) Chin, Seth A Strawbridge, Marysol Garcia-Patino, Ray
                  Kruger, Aadhavya Sivakumaran, Selena Sanford, Rahil Doshi,
                  Nitya Khetarpal, Omolola Fatokun, Daphnee Doucet, Ashley
                  Zubkowski, Dorsa Yahya Rayat, Hayley Jackson, Karxena Harford,
                  Afia Anjum, Mahi Zakir, Fei Wang, Siyang Tian, Brian Lee,
                  Jaanus Liigand, Harrison Peters, Ruo Qi (Rachel) Wang, Tue
                  Nguyen, Denise So, Matthew Sharp, Rodolfo da Silva, Cyrella
                  Gabriel, Joshua Scantlebury, Marissa Jasinski, David Ackerman,
                  Timothy Jewison, Tanvir Sajed, Vasuk Gautam, David S Wishart,
                  DrugBank 6.0: the DrugBank Knowledgebase for 2024, Nucleic
                  Acids Research, Volume 52, Issue D1, 5 January 2024, Pages
                  D1265–D1275,{' '}
                  <Link
                    href="https://doi.org/10.1093/nar/gkad976"
                    title="DrugBank 6.0: the DrugBank Knowledgebase for 2024 "
                    underline="hover"
                    target="_blank"
                  >
                    https://doi.org/10.1093/nar/gkad976
                  </Link>
                  .
                </Alert>
              </p>
              <p></p>
              If you use the <b>Ensembl dataset</b>, you must acknowledge the
              project by citing the publication:
              <p>
                <Alert
                  severity="warning"
                  icon={<ContentCopyIcon fontSize="inherit" />}
                >
                  Sarah C Dyer, Olanrewaju Austine-Orimoloye, Andrey G Azov,
                  Matthieu Barba, If Barnes, Vianey Paola Barrera-Enriquez, Arne
                  Becker, Ruth Bennett, Martin Beracochea, Andrew Berry,
                  Jyothish Bhai, Simarpreet Kaur Bhurji, Sanjay Boddu, Paulo R
                  Branco Lins, Lucy Brooks, Shashank Budhanuru Ramaraju, Lahcen
                  I Campbell, Manuel Carbajo Martinez, Mehrnaz Charkhchi, Lucas
                  A Cortes, Claire Davidson, Sukanya Denni, Kamalkumar Dodiya,
                  Sarah Donaldson, Bilal El Houdaigui, Tamara El Naboulsi,
                  Oluwadamilare Falola, Reham Fatima, Thiago Genez, Jose
                  Gonzalez Martinez, Tatiana Gurbich, Matthew Hardy, Zoe Hollis,
                  Toby Hunt, Mike Kay, Vinay Kaykala, Diana Lemos, Disha Lodha,
                  Nourhen Mathlouthi, Gabriela Alejandra Merino, Ryan Merritt,
                  Louisse Paola Mirabueno, Aleena Mushtaq, Syed Nakib Hossain,
                  José G Pérez-Silva, Malcolm Perry, Ivana Piližota, Daniel
                  Poppleton, Irina Prosovetskaia, Shriya Raj, Ahamed Imran Abdul
                  Salam, Shradha Saraf, Nuno Saraiva-Agostinho, Swati Sinha,
                  Botond Sipos, Vasily Sitnik, Emily Steed, Marie-Marthe Suner,
                  Likhitha Surapaneni, Kyösti Sutinen, Francesca Floriana
                  Tricomi, Ian Tsang, David Urbina-Gómez, Andres Veidenberg,
                  Thomas A Walsh, Natalie L Willhoft, Jamie Allen, Jorge
                  Alvarez-Jarreta, Marc Chakiachvili, Jitender Cheema, Jorge
                  Batista da Rocha, Nishadi H De Silva, Stefano Giorgetti,
                  Leanne Haggerty, Garth R Ilsley, Jon Keatley, Jane E Loveland,
                  Benjamin Moore, Jonathan M Mudge, Guy Naamati, John Tate,
                  Stephen J Trevanion, Andrea Winterbottom, Bethany Flint, Adam
                  Frankish, Sarah E Hunt, Robert D Finn, Mallory A Freeberg,
                  Peter W Harrison, Fergal J Martin, Andrew D Yates, Ensembl
                  2025, Nucleic Acids Research, Volume 53, Issue D1, 6 January
                  2025, Pages D948–D957,{' '}
                  <Link
                    href="https://doi.org/10.1093/nar/gkae1071"
                    title="Ensembl 2025"
                    underline="hover"
                    target="_blank"
                  >
                    https://doi.org/10.1093/nar/gkae1071
                  </Link>
                  .
                </Alert>
              </p>
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ paddingTop: 2, paddingRight: 2, pr: 3 }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={closeModal}
              underline="hover"
              sx={{
                color: 'primary.main',
                fontWeight: 'medium',
                textTransform: 'uppercase',
              }}
            >
              Close
            </Link>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
