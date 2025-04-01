# MQTT Communication Backend

This subproject provides a MQTT communication backend for communicating with [EVerest](https://github.com/EVerest/EVerest).

## Running
The MQTT communication backend can be launched as follows:

```bash
uvicorn compote.cs_everest.cs_everest_mqtt_fastapi:app --reload --log-level error --port 8004
```