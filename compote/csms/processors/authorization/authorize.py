from typing import Dict, Optional, List

from compote.csms.context.csms_context import Context
from compote.csms.analytics.stats import log_processing


class GenericAuthorizeProcessor:
    async def process(self, context: Context, id_tag: str):
        return True

class OCPP16AuthorizeProcessor(GenericAuthorizeProcessor):
    @log_processing(name="process_authorize")
    async def process(self, context: Context, id_tag: str):
        id_tag_info = {'status' : await context.determine_authorization_status(id_tag)}
        certificate_status = "Accepted"
        result = {'id_tag_info' : id_tag_info}
        return result

class OCPP20AuthorizeProcessor(GenericAuthorizeProcessor):
    @log_processing(name="process_authorize")
    async def process(self, context: Context, id_token: Dict, certificate: Optional[str] = None, iso15118_certificate_hash_data: Optional[List] = None):
        # TODO Implement certificate status
        id_token_info = {'status' : await context.determine_authorization_status(id_token["id_token"])}
        certificate_status = "Accepted"
        result = {'id_token_info' : id_token_info, 'certificate_status' : certificate_status}
        return result