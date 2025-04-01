from fastapi import FastAPI

from compote.cs_everest.cspncservice.pnc_routes import router as PncRouter
from compote.cs_everest.cspncservice.ccp_pnc_routes import router as CcpPncRouter
from compote.cs_everest.cspncservice.rcp_pnc_routes import router as RcpPncRouter

def create_pnc_api_app():
    pncapp = FastAPI(
        title="CS PNC API",
        version="0.0.1",
    )

    pncapp.include_router(PncRouter)
    pncapp.include_router(CcpPncRouter)
    pncapp.include_router(RcpPncRouter)

    return pncapp
