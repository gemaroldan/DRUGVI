import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ReactDOM from 'react-dom/client';
import './index.css';
//import reportWebVitals from './reportWebVitals';

import Home from './pages/pathwaysPage/PathwaysPage';
import PathwaysPage from './pages/pathwaysPage/PathwaysPage';
import About from './pages/About';
import DiseaseMapPage from './pages/diseaseMapPage/DiseaseMapPage';

import NoFound from './pages/NoFound';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { AppNavbar } from './components/NavBar/components/AppBar/AppNavbar';
import Privacy from './pages/Privacy';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <Router>
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <AppNavbar></AppNavbar>
        <Routes>
          <Route path={process.env.PUBLIC_URL} element={<Home />} />
          <Route
            path={`${process.env.PUBLIC_URL}/pathways`}
            element={<PathwaysPage />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/diseases-map`}
            element={<DiseaseMapPage />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/privacy`}
            element={<Privacy />}
          />
          <Route path={`${process.env.PUBLIC_URL}/about`} element={<About />} />
          <Route path="*" element={<NoFound />} />
        </Routes>
      </RecoilRoot>
    </ThemeProvider>
  </Router>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
