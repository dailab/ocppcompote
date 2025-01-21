from typing import Any

from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.trace import Span


def client_request_hook(span: Span, scope: dict[str, Any], message: dict[str, Any]):
    if span and span.is_recording():
        if "body" in message:
            request_body = message["body"]
            span.set_attribute("http.request.body", request_body)

def client_response_hook(span: Span, scope: dict[str, Any], message: dict[str, Any]):
    if span and span.is_recording():
        if "body" in message:
            response_body = message["body"]
            span.set_attribute("http.response.body", response_body)

def instrument_fastapi(app):
    FastAPIInstrumentor.instrument_app(app, client_request_hook=client_request_hook, client_response_hook=client_response_hook, excluded_urls="gui")