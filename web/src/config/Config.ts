class Config {
  //static readonly API_ENDPOINT = 'http://192.168.1.133:5000/';
  //static readonly API_ENDPOINT = 'http://192.168.155.238:5000/';
  static readonly API_ENDPOINT = 'http://localhost:5000/';

  static readonly APP = {
    TITLE: 'Visualizer for drug discovery and repositioning',
    ABR: 'DRUGVI',
    LOGO: 'images/logo_CSVS.png',
    DOCUMENTATION: 'https://github.com/gemaroldan/DRUGVI/wiki',
    SOURCE: 'https://github.com/gemaroldan/DRUGVI',
  };

  static readonly PATH_ROUTES = {
    HOME: '/',
    PATHWAY: '/pathways',
    DISEASE_MAP: '/diseases-map',
    PRIVACY: '/privacy',
    ABOUT: '/about',
  };
}

export default Config;
