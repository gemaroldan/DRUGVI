from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional, Dict

from models.ProteinTarget import ProteinTarget

@dataclass
class Drug:
    """Representa un fármaco registrado en DrugBank."""
    main_drugbank_id: str
    name: str
    synonyms: List[str] = field(default_factory=list)
    targets: List[ProteinTarget] = field(default_factory=list) 
