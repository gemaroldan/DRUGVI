interface Gene {
  id: number;
  name: string;

  ensemble_id: string;
  seq_region_end: number;
  seq_region_name: string;
  seq_region_start: number;
  symbol: string;
  synonyms: string[];
  transcript_stable_id: string;
}

export default Gene;
