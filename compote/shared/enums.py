from enum import Enum

class IdTag(str, Enum):
    accepted = "Accepted"
    blocked = "Blocked"
    expired = "Expired"
    invalid = "Invalid"
    concurrent = "ConcurrentTx"


class Transaction(str, Enum):
    active = "Active"
    stopped = "Stopped"
    expired = "Expired"
    invalid = "Invalid"