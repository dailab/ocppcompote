from dataclasses import dataclass

from compote.shared.enums import IdTag

@dataclass
class AuthIdTag:
    id: str
    name: str
    value: str
    parent_id: str
    expiry_date: str
    status: IdTag