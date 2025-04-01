from fastapi import FastAPI

# OICP EMP Client
from compote.csms.cpooicpservice.pricingroutes import router as ERoamingPricingRouter
from compote.csms.cpooicpservice.evsestatusroutes import router as ERoamingEvseStatusRouter
from compote.csms.cpooicpservice.chargingnotifications import router as ERoamingChargingNotificationsRouter
from compote.csms.cpooicpservice.authorizationroutes import router as ERoamingAuthorizationRouter

# OICP EMP Server
from compote.csms.cpooicpservice.reservationroutes import router as ERoamingReservationRouter
from compote.csms.cpooicpservice.remoteauthorizationroutes import router as ERoamingRemoteAuthorizationRouter

def create_oicp_api_app():
    oicpapiapp = FastAPI(
        title="CSMS OICP API",
        version="0.0.1",
    )

    # OICP CPO Client
    oicpapiapp.include_router(ERoamingPricingRouter)
    oicpapiapp.include_router(ERoamingAuthorizationRouter)
    oicpapiapp.include_router(ERoamingEvseStatusRouter)
    oicpapiapp.include_router(ERoamingChargingNotificationsRouter)

    # OICP CPO Server
    oicpapiapp.include_router(ERoamingReservationRouter)
    oicpapiapp.include_router(ERoamingRemoteAuthorizationRouter)

    return oicpapiapp
