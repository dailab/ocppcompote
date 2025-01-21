import logging

from opentelemetry.instrumentation.logging import LoggingInstrumentor

def instrument_logging():
    LoggingInstrumentor().instrument(log_level=logging.INFO, set_logging_format=True)