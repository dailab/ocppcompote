from opentelemetry import trace
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

from compote.shared.analytics.fastapi_opentelemetry_instrumentor import instrument_fastapi
from compote.shared.analytics.httpx_opentelemetry_instrumentor import instrument_httpx
from compote.shared.analytics.logging_opentelemetry_instrumentor import instrument_logging


def configure_opentelemetry(app, service_name: str, exporter = None):
    resource = Resource(attributes={
        SERVICE_NAME: service_name
    })

    trace.set_tracer_provider(TracerProvider(resource=resource))

    if not exporter: exporter = ConsoleSpanExporter()

    span_processor = SimpleSpanProcessor(exporter)

    trace.get_tracer_provider().add_span_processor(span_processor)

    instrument_fastapi(app)
    instrument_httpx()
    instrument_logging()
