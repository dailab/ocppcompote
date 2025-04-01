from fastapi import FastAPI

from compote.emp.emppncservice.pnc_routes import router as PncRouter
from compote.emp.emppncservice.ccp_pnc_routes import router as CcpPncRouter
from compote.emp.emppncservice.cps_pnc_routes import router as CpsPncRouter
from compote.emp.emppncservice.pcp_pnc_routes import router as PcpPncRouter
from compote.emp.emppncservice.est_pnc_routes import router as EstPncRouter
from compote.emp.emppncservice.rcp_pnc_routes import router as RcpPncRouter

def create_pnc_api_app():
    pncapp = FastAPI(
        title="EMP PNC API",
        version="0.0.1",
    )

    pncapp.include_router(PncRouter)
    pncapp.include_router(CpsPncRouter)
    pncapp.include_router(CcpPncRouter)
    pncapp.include_router(PcpPncRouter)
    pncapp.include_router(EstPncRouter)
    pncapp.include_router(RcpPncRouter)

    return pncapp
