from fastapi import FastAPI

from compote.csms.cpopncservice.pnc_routes import router as PncRouter
from compote.csms.cpopncservice.ca_routes import router as CaRouter
from compote.csms.cpopncservice.ccp_pnc_routes import router as CcpPncRouter
from compote.csms.cpopncservice.est_pnc_routes import router as EstPncRouter
from compote.csms.cpopncservice.rcp_pnc_routes import router as RpcPncRouter

def create_pnc_api_app():
    pncapp = FastAPI(
        title="CSMS PNC API",
        version="0.0.1",
    )

    pncapp.include_router(PncRouter)
    pncapp.include_router(CaRouter)
    pncapp.include_router(CcpPncRouter)
    pncapp.include_router(EstPncRouter)
    pncapp.include_router(RpcPncRouter)

    return pncapp
