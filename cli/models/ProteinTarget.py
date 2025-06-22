from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional, Dict

@dataclass
class ProteinTarget:
    """Target type protein."""
    drugbank_id:str
    name: str
    organism: str
    actions: List[str]
    polypeptide: List[Polypeptide]


@dataclass
class Polypeptide:
    id: str
    source: str
    general_function: str
    gene_name: str
    external_ids: Dict[str, str]