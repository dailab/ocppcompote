from dataclasses import dataclass
from enum import Enum

from compote.csms.context.csms_context import Context


class ContextIdErr(str, Enum):
    valid = "No error"
    notindex = "No matching index"
    notnumber = "Not a number"
    nocontext = "No context found"

@dataclass
class ContextResult:
    valid: bool
    error: ContextIdErr
    context: Context
