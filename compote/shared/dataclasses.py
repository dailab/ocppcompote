from typing import List

from pydantic.dataclasses import dataclass

from compote.shared.enums import IdTag

@dataclass
class AuthIdTag:
    id: str
    name: str
    value: str
    parent_id: str
    expiry_date: str
    status: IdTag

@dataclass
class User:
    id: str
    name: str
    id_tags: List[str]