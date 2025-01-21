from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor

def request_hook(span, request):
    if "body" in request.headers:
        request_body = request
        span.set_attribute("http.request.body", request_body)

def response_hook(span, request, response):
    status_code, headers, stream, extensions = response
    span.set_attribute("http.response.body", status_code)

    if "body" in response.headers:
        response_body = response
        span.set_attribute("http.response.body", response_body)

async def async_request_hook(span, request):
    if "body" in request.headers:
        request_body = request
        span.set_attribute("http.request.body", request_body)

async def async_response_hook(span, request, response):
    status_code, headers, stream, extensions = response

    span.set_attribute("http.response.body", str(stream))
    if "body" in response.headers:
        response_body = response
        span.set_attribute("http.response.body", response_body)


def instrument_httpx():
    HTTPXClientInstrumentor().instrument(
        request_hook=request_hook,
        response_hook=response_hook,
        async_request_hook=async_request_hook,
        async_response_hook=async_response_hook
    )