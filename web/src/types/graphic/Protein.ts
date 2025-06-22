interface Protein {
  id: number;
  name: string;

  uniprot_id: string;
  external_ids: string[];
  gene_name: string;
  general_function: string;
  source: string;
}

export default Protein;
