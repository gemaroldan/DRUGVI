import NFunction from './NFunction';
import NPathway from './NPathway';
import Gene from './Gene';
import Drug from './Drug';
import Protein from './Protein';

interface DetailNPathway {
  id: string;
  name: string;
  npathways?: NPathway[] | null;
  nfunctions?: NFunction[] | null;
  genes?: Gene[] | null;
  drugs?: Drug[] | null;
  proteins?: Protein[] | null;
}

export default DetailNPathway;
