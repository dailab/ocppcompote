from fastapi import FastAPI

# OICP EMP Client
from compote.emp.empoicpservice.pricingroutes import router as ERoamingPricingRouter
from compote.emp.empoicpservice.reservationroutes import router as ERoamingReservationRouter
from compote.emp.empoicpservice.remoteauthorizationroutes import router as ERoamingRemoteAuthorizationRouter
from compote.emp.empoicpservice.authenticationroutes import router as ERoamingAuthenticationRouter
from compote.emp.empoicpservice.evsestatusroutes import router as ERoamingEvseStatusRouter

# OICP EMP Server
from compote.emp.empoicpservice.authorizationroutes import router as ERoamingAuthorizationRouter
from compote.emp.empoicpservice.chargingnotifications import router as ERoamingChargingNotificationsRouter


def create_api_app():
    apiapp = FastAPI(
        title="EMPMS API",
        version="0.0.1",
    )

    # OICP EMP Client
    apiapp.include_router(ERoamingPricingRouter)
    apiapp.include_router(ERoamingReservationRouter)
    apiapp.include_router(ERoamingRemoteAuthorizationRouter)
    apiapp.include_router(ERoamingAuthenticationRouter)
    apiapp.include_router(ERoamingEvseStatusRouter)

    # OICP EMP Server
    apiapp.include_router(ERoamingAuthorizationRouter)
    apiapp.include_router(ERoamingChargingNotificationsRouter)

    return apiapp
